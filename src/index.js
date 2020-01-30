const {
  QMainWindow,
  QMovie,
  QWidget,
  QLabel,
  QLineEdit,
  QPushButton,
  FlexLayout,
  QScrollArea,
  QApplication,
  QClipboardMode,
  QMessageBox,
  QSystemTrayIcon,
  QIcon,
  QMenu,
  QAction,
  ButtonRole,
  WidgetEventTypes,
  QDialog
} = require("@nodegui/nodegui");
const axios = require("axios").default;
const iconImg = require("../assets/systray.png").default;
const path = require("path");

const main = async () => {
  const win = new QMainWindow();
  win.setWindowTitle("Meme Search");

  const center = new QWidget();
  center.setLayout(new FlexLayout());

  const scrollArea = new QScrollArea();
  scrollArea.setWidgetResizable(false);
  scrollArea.setInlineStyle(`flex: 1; width: 340px; height: 400px;`);
  const searchContainer = createSearchContainer(async searchText => {
    try {
      // Create a new gif container with new gifs
      const listOfGifs = await searchGifs(searchText);
      const newGifContainer = await getGifViews(listOfGifs);
      // remove existing container from the scrollArea
      const oldContainer = scrollArea.takeWidget();
      if (oldContainer) {
        oldContainer.close();
      }
      // add the new gif container to the scrollArea
      scrollArea.setWidget(newGifContainer);
    } catch (err) {
      console.error("Something happened!", err);
      showModal("Something is wrong!", JSON.stringify(err));
    }
  });
  center.layout.addWidget(searchContainer);
  center.layout.addWidget(scrollArea);

  win.setCentralWidget(center);
  win.show();
  systemTrayIcon(win);

  showAPIKeyDialog();

  global.win = win;
};

async function getMovie(url) {
  const { data } = await axios.get(url, { responseType: "arraybuffer" });
  const movie = new QMovie();
  movie.loadFromData(data);
  movie.start();
  return movie;
}

let GIPHY_API_KEY = "";

async function searchGifs(searchTerm) {
  const url = `https://api.giphy.com/v1/gifs/search`;
  const { data } = await axios.get(url, {
    params: {
      api_key: GIPHY_API_KEY,
      limit: 25,
      q: searchTerm,
      lang: "en",
      offset: 0,
      rating: "pg-13"
    }
  });
  return data.data;
}

async function getGifViews(listOfGifs) {
  const container = new QWidget();
  container.setLayout(new FlexLayout());

  const promises = listOfGifs.map(async gif => {
    const { url, width } = gif.images.fixed_width_small;
    const movie = await getMovie(url);
    const gifView = new QLabel();
    gifView.setMovie(movie);
    gifView.setInlineStyle(`width: ${width}`);
    gifView.addEventListener(WidgetEventTypes.MouseButtonRelease, () => {
      const clipboard = QApplication.clipboard();
      clipboard.setText(url, QClipboardMode.Clipboard);
      showModal(
        "Copied to clipboard!",
        `You can press Cmd/Ctrl + V to paste the gif url: ${url}`
      );
    });
    container.layout.addWidget(gifView);
  });

  await Promise.all(promises);
  container.setInlineStyle(`
      flex-direction: 'row';
      flex-wrap: 'wrap';
      justify-content: 'space-around';
      width: 330px;
  `);
  return container;
}

function createSearchContainer(onSearch) {
  const searchContainer = new QWidget();
  searchContainer.setObjectName("searchContainer");
  searchContainer.setLayout(new FlexLayout());

  const searchInput = new QLineEdit();
  searchInput.setObjectName("searchInput");

  const searchButton = new QPushButton();
  searchButton.setObjectName("searchButton");
  searchButton.setText(" 🔎 ");

  searchButton.addEventListener("clicked", () => {
    onSearch(searchInput.text());
  });

  searchContainer.layout.addWidget(searchInput);
  searchContainer.layout.addWidget(searchButton);

  searchContainer.setStyleSheet(`
    #searchContainer {
      flex-direction: 'row';
      padding: 10px;
      align-items: 'center';
    }
    #searchInput {
      flex: 1;
      height: 40px;
    }
    #searchButton {
      margin-left: 5px;
      width: 50px;
      height: 35px;
    }  
  `);
  return searchContainer;
}

function showModal(title, details) {
  const modal = new QMessageBox();
  modal.setText(title);
  modal.setDetailedText(details);
  const okButton = new QPushButton();
  okButton.setText("OK");
  modal.addButton(okButton, ButtonRole.AcceptRole);
  modal.exec();
}

function systemTrayIcon(win) {
  const icon = new QIcon(path.resolve(__dirname, iconImg));
  const tray = new QSystemTrayIcon();
  tray.setIcon(icon);
  tray.show();

  // Menu that should popup when clicking on systray icon.
  const menu = new QMenu();
  tray.setContextMenu(menu);

  //Each item in the menu is called an action
  const visibleAction = new QAction();
  menu.addAction(visibleAction);
  visibleAction.setText("Show/Hide");
  visibleAction.addEventListener("triggered", () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });

  global.tray = tray;
}

function showAPIKeyDialog() {
  const dialog = new QDialog();
  dialog.setLayout(new FlexLayout());
  const label = new QLabel();
  label.setText("Enter your Giphy API Key");
  const input = new QLineEdit();
  const okButton = new QPushButton();
  okButton.setText("OK");
  okButton.addEventListener("clicked", () => {
    GIPHY_API_KEY = input.text();
    dialog.close();
  });
  dialog.layout.addWidget(label);
  dialog.layout.addWidget(input);
  dialog.layout.addWidget(okButton);
  dialog.setInlineStyle(`
    padding: 10;
    height: 150px;
    flex-direction: 'column';
    align-items:'center';
    justify-content: 'space-around';
  `);
  dialog.exec();
}

main().catch(console.error);
