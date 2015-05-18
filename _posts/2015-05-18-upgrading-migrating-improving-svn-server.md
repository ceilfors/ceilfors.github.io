---
layout: post
title:  "Guide on upgrading, migrating, and improving SVN Server"
tags: subversion svn python
comments: true
---

Long story short, this guide will help you to go from the *current state* to the *envisioned state*.

__Current state:__

- SVN Server 1.4.6 - Released December 2007
- RHEL 4 - Released November 2007
- Maintenance hell - authz and passwd for every SVN repositories

__Envisioned state:__

- SVN Server 1.8.13 - Released March 2015
- SLES - Released July 2013
- SSO with LDAP group as authorization strategy and a single authz file
- DNS and SSL offloading via reverse proxy

## Exporting the repository

To migrate a SVN repository, you must export or *dump* the repository, transfer it over to the new server, and load it to a new repository. The export process will produce a dump file.

```
svnadmin dump /svn/myrepository > myrepository.dump
```

The dump file can be pretty huge, so gzipping it will greatly reduce the file on disk.

While you are waiting on the dumping process, you might have found that you can actually `scp` or `rsync` the SVN repository directory and call `svnadmin upgrade` directly. This is a lot faster than dumping and loading a repository. If you are upgrading the SVN server, my recommendation is *don't do* this. This is the quote from `svnadmin help upgrade`:

> This functionality is provided as a convenience for repository
administrators who wish to make use of new Subversion functionality
without having to undertake a potentially costly full repository dump
and load operation.  As such, the upgrade performs only the minimum
amount of work needed to accomplish this while still maintaining the
integrity of the repository. __It does not guarantee the most optimized
repository state as a dump and subsequent load would__.

## Repairing the dump - non-LF line endings

If your SVN repository is as old as ours, you might hit the error below:

```
svnadmin: E125005: Invalid property value found in dumpstream; consider repairing the source or using --bypass-prop-validation while loading.
svnadmin: E125005: Cannot accept non-LF line endings in 'svn:log' property
```

This error is caused by carriage return characters (Control+M / ^M) stored in those properties. I will not recommend using `--bypass-prop-validation` nor using `sed`. `--bypass-prop-validation` is just going to postpone problems.

Removing ^M characters with `sed` seems viable, but the problem is you can't actually *remove* them, you can only *replace* the them. This is because the dump files are storing a variable called `Prop-content-length` which is storing the actual length of the property. If you remove the characters which reduces the actual property length, a dump file is deemed corrupted and you won't be able to load it. Wrong regex will also potentially __corrupt the binary files__ stored in the dump files.

My recommendation is to use [svndumptool][svndumptool]. This tool completely removes the ^M characters properly and it will also adjust the `Prop-content-length` and `Content-length` respectively.

This non-LF line endings error is happening for me on svn:log, svn:ignore and svn:externals. So the commands that I have executed to the dump files are:

```
svndumptool.py eolfix-prop svn:externals in out
svndumptool.py eolfix-prop svn:ignore in out
svndumptool.py eolfix-revprop svn:log in out
```

It's crucial to determine if a property requires `eolfix-prop` or `eolfix-revprop` option to make svndumptool work correctly. To determine which one you need, refer to [SVN Properties](http://svnbook.red-bean.com/en/1.7/svn.ref.properties.html) documentation and get the list of Versioned and Unversioned properties, then map it like so:

- Versioned Properties: eolfix-prop
- Unversioned Properties: eolfix-revprop

## Repairing the dump - svn:externals

Most of our __svn:externals__ are having absolute URLs. This will no longer work in our new server. The fastest way to resolve this issue is to repair the dump files.

To list down all of the currently used svn:externals, you will need to recursively check each of the directories in your SVN repositories. Because our repositories are huge, we need a quick way to extract these properties. In order to do this, I have written a python script that you can use here: [externals.py](https://gist.github.com/ceilfors/741d8152106a310dd454). (Credits to [NeoSkye](http://stackoverflow.com/a/10286163/2464295)).

```
externals.py file:///svn/repository
```

Notice that I'm using file protocol as this will quicken the process by not consuming network. You will need to of course SSH to the server. Once you have all of the svn:externals extracted out, figure out what kind of patterns or syntax that have been used in your SVN repositories.

Next we are ready to edit those dump files. I'm using [svndumptool][svndumptool] again here which works like a charm. It is good to migrate all of the reference to the server and change them to become a relative URL. In my case, I only have two patterns:

```
svndumptool.py transform-prop svn:externals "^(svn://server-name/uk/)(/.*)" "/relativeroot\2" in out
svndumptool.py transform-prop svn:externals "(\S*)\s+(svn://server-name/uk)(/\S*)" "/relativeroot\3 \1" in out
```

To migrate various other svn:externals format, refer to this [SO thread](http://stackoverflow.com/questions/21292688/regex-for-svndumptool).

## Importing and finalizing migration
Do the following in the new server:

- Create a new SVN repository
- Load the dump that you have repaired
- Verify the repository (I think this is optional, but just in case)
- Copy the previously configured hooks you have

``` 
svnadmin create --compatible-version 1.4.6 repository_path
svnadmin load --force-uuid $REPOSITORY < repaired_dump_file
svnadmin verify repository_path
rsync --exclude "*.tmpl" user@old-server:old_repository_path/hooks/* repository_path/hooks
```

## Improving authentication and authorization strategy
In the *envisioned state*, I want to use SSO as our authentication strategy. Since we are using CollabNet Subversion Edge 4.0.14, it is very easy to setup SSO as everything is GUI based and everything is already well integrated.

The authorization part is the tricky bit. Previously we have a problem where each of the SVN repositories are having their own authz files, and it is a nightmare to migrate all of them to a single authz file in SVN Edge. The solution that I come up with is to use LDAP groups to authorize SVN users. It is however not simple to achieve this in SVN server because the authorization is tight to authz file.

A very handy script called [ldap-to-authz][ldap-to-authz] will do the trick. As of writing, I would recommend you to grab the script from [dr4Ke GitHub repository][ldap-to-authz] instead of from the [original whitlockjc bitbucket repository](https://bitbucket.org/whitlockjc/jw-tools). The one maintained by dr4Ke have the following benefits:

1. Extra option to follow nested LDAP groups
2. Extra option to grab specific LDAP groups instead of scanning the whole LDAP server.

Read the script's documentation on how you can make use of it. The rest is pretty straightforward, basically you will need to write a script to merge these:

1. Your changes via SVN Edge UI
2. The automatically generated LDAP group content from ldap-to-authz

Then run the script in cron. You can get the script [here](http://serverfault.com/a/401181) for reference. In addition to the merging, I also backup the previous authz file every time the cron runs.

## Pretty URL with https
To have a pretty URL with https, you need to have a DNS that points to a reverse proxy,
and a reverse proxy that forwards port 443 to 18080. This generates some problems.

Without configuring SVN Edge, you will not be able do an SVN move or copy:

```
COPY request on '/svn/foo/!svn/rvr/3880/project/trunk'
failed: 502 Bad Gateway
```

This is happening because we are forwarding https to http. To resolve this issue, you need to configure `csvn/data/conf/httpd.conf` and `csvn/dist/httpd.conf.dist`. Simply add the following snippets to the end of the file:

```
LoadModule headers_module lib/modules/mod_headers.so
RequestHeader edit Destination ^https http early
```

Another small problem that you might encounter is in ViewVC. At every bottom of a page, ViewVC shows a `svn checkout` command guide. This checkout URL will not be reflected to your DNS and reverse proxy. To configure this, you will need to add the below snippet to `csvn/dist/viewvc.conf.dist` and restart it.

```
csvn_svn_base_url=https://pretty-url/svn/
```

 [svndumptool]: https://github.com/jwiegley/svndumptool
 [ldap-to-authz]: https://github.com/dr4Ke/ldap-to-svn-authz