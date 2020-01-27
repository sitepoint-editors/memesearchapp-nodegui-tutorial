const {
  QMainWindow,
  QMovie,
  QWidget,
  QLabel,
  FlexLayout
} = require("@nodegui/nodegui");
const axios = require("axios").default;

const main = async () => {
  const win = new QMainWindow();
  win.setWindowTitle("Meme Search");

  const center = new QWidget();
  center.setLayout(new FlexLayout());

  const listOfGifs = await searchGifs("hello");
  const container = await getGifViews(listOfGifs);

  center.layout.addWidget(container);

  win.setCentralWidget(center);
  win.show();

  global.win = win;
};

async function getMovie(url) {
  const { data } = await axios.get(url, { responseType: "arraybuffer" });
  const movie = new QMovie();
  movie.loadFromData(data);
  movie.start();
  return movie;
}

const GIPHY_API_KEY = "your api key";

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
    container.layout.addWidget(gifView);
  });

  await Promise.all(promises);
  container.setInlineStyle(`
      flex-direction: 'row';
      flex-wrap: 'wrap';
      justify-content: 'space-around';
      width: 330px;
      height: 300px;
  `);
  return container;
}

main().catch(console.error);
