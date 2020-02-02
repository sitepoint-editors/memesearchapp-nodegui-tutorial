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
diff --git a/src/index.js b/src/index.js
index e4baf86..ecd6bf0 100644
--- a/src/index.js
+++ b/src/index.js
@@ -15,7 +15,8 @@ const {
   QMenu,
   QAction,
   ButtonRole,
-  WidgetEventTypes
+  WidgetEventTypes,
+  QDialog
 } = require("@nodegui/nodegui");
 const axios = require("axios").default;
 const iconImg = require("../assets/systray.png").default;
@@ -55,6 +56,8 @@ const main = async () => {
   win.show();
   systemTrayIcon(win);
 
+  showAPIKeyDialog();
+
   global.win = win;
 };
 
@@ -66,7 +69,7 @@ async function getMovie(url) {
   return movie;
 }
 
-const GIPHY_API_KEY = "your api key";
+let GIPHY_API_KEY = "";
 
 async function searchGifs(searchTerm) {
   const url = `https://api.giphy.com/v1/gifs/search`;
@@ -187,4 +190,29 @@ function systemTrayIcon(win) {
   global.tray = tray;
 }
 
+function showAPIKeyDialog() {
+  const dialog = new QDialog();
+  dialog.setLayout(new FlexLayout());
+  const label = new QLabel();
+  label.setText("Enter your Giphy API Key");
+  const input = new QLineEdit();
+  const okButton = new QPushButton();
+  okButton.setText("OK");
+  okButton.addEventListener("clicked", () => {
+    GIPHY_API_KEY = input.text();
+    dialog.close();
+  });
+  dialog.layout.addWidget(label);
+  dialog.layout.addWidget(input);
+  dialog.layout.addWidget(okButton);
+  dialog.setInlineStyle(`
+    padding: 10;
+    height: 150px;
+    flex-direction: 'column';
+    align-items:'center';
+    justify-content: 'space-around';
+  `);
+  dialog.exec();
+}
+
 main().catch(console.error);


```


## License

MIT
