---
title: FintechOS Installation
id: fintechos-installation
sidebar_label: FintechOS Installation
---

Ad dolore proident dolor ex voluptate ut consectetur voluptate et tempor Lorem. Lorem duis proident irure sit sint ex laborum Lorem laboris mollit sunt consectetur. Amet cillum amet eiusmod do amet et non aliqua eiusmod non eu. Nisi eu laboris exercitation sint sit pariatur eiusmod elit reprehenderit voluptate velit. Irure cupidatat excepteur excepteur dolore officia id eu mollit cupidatat eu.

## Download release kit and syspacks

## Create instance database

To create the instance database `ftos`

1. Open Microsoft SQL Server Manager on the server.
2. Expand the database server node in `Object manager`.
3. Right-click on `Databases` and choose `New database...`.
4. Create the instance database (e.g. `ftos`) in `New database` dialog.

The instance database appears in the list under `Databases` in `Object manager`.

## Install instance

Create the `instance root folder` -- the Studio and Portal web-apps will be installed in this folder.

```bash
cd <path/to/all/instances>
mkdir ftos
```

### Step 1: Populate instance database

1. Create a `ftos-dbupgrade.bat` file in a folder of your choice, and copy the following:

```bash
cd <path/to/kits>/<releaseKitFolder>/SQL
start BasicDbUpgrade -i -s <dbServerName> -d ftos && BasicDbUpgrade -w -s <dbServerName> -d ftos && BasicDbUpgrade -u -s <dbServerName> -d ftos
pause
```

2. Run `ftos-dbgrade.bat` as administrator.

:::caution
It is vital to run the `.bat` file as Administrator. Do not ignore this suggestion.
:::

### Step 2: Install Studio web-app

1. Create a `ftos-install-studio.bat` file in a folder of your choice, and copy the following:

```bash
cd <path/to/kits>/<releaseKitFolder>/Tools
powershell -File "DesignerWepAppInstaller.ps1" BasicDbUpgrade -i -s <dbServerName> -d ftos && BasicDbUpgrade -w -s <dbServerName> -d ftos && BasicDbUpgrade -u -s <dbServerName> -d ftos
pause
```

2. Run `ftos-install-studio.bat` as administrator.

:::caution
It is vital to run the `.bat` file as Administrator. Do not ignore this suggestion.
:::

### Step 3: Install Portal web-app

## Open Studio and Portal

*Provide the url for Studio and Portal, showing the url in the address bar.*