# Meme Search App

This is a meme search app built using NodeGui and Giphy API for the tutorial here:

**You need GIPHY API key to run the development version and the distributables**

This app is for educational purposes only.

<center>
<img src="./assets/final.gif" alt="final gif" width="600" />
</center>

## To run

From your command line:

```bash
npm install
# Run the app
npm start
```

Distributables for Mac, Windows and Linux can be found under releases: https://github.com/master-atul/memesearchapp-nodegui-tutorial/releases

The distributables have a minor code patch added as compared to the tutorial one. This allows user to enter their own GIPHY API key and use the app.

The patch looks like this:

```diff
From c36d3cc44c0e8b07307e8ec2fae0bad1d3d85e03 Mon Sep 17 00:00:00 2001
From: Atul R <atulanand94@gmail.com>
Date: Thu, 30 Jan 2020 23:32:50 +0100
Subject: [PATCH] Adds input dialog for api key

---
 src/index.js | 11 +++++++++--
 1 file changed, 9 insertions(+), 2 deletions(-)

diff --git a/src/index.js b/src/index.js
index e4baf86..70459e6 100644
--- a/src/index.js
+++ b/src/index.js
@@ -15,7 +15,8 @@ const {
   QMenu,
   QAction,
   ButtonRole,
-  WidgetEventTypes
+  WidgetEventTypes,
+  QInputDialog
 } = require("@nodegui/nodegui");
 const axios = require("axios").default;
 const iconImg = require("../assets/systray.png").default;
@@ -66,7 +67,13 @@ async function getMovie(url) {
   return movie;
 }
 
-const GIPHY_API_KEY = "your api key";
+let GIPHY_API_KEY = "";
+const apiKeyDialog = new QInputDialog();
+apiKeyDialog.setLabelText("Enter your Giphy API key to continue");
+apiKeyDialog.addEventListener("textValueSelected", text => {
+  GIPHY_API_KEY = text;
+});
+apiKeyDialog.exec();
 
 async function searchGifs(searchTerm) {
   const url = `https://api.giphy.com/v1/gifs/search`;

```


## License

MIT
