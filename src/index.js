const { QMainWindow, QMovie, QLabel } = require("@nodegui/nodegui");
const axios = require("axios").default;

const main = async () => {
  const win = new QMainWindow();
  win.setWindowTitle("Meme Search");

  const label = new QLabel();
  label.setText("Hello World");

  const gifMovie = await getMovie(
    "https://upload.wikimedia.org/wikipedia/commons/e/e3/Animhorse.gif"
  );
  label.setMovie(gifMovie);

  win.setCentralWidget(label);
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

main().catch(console.error);
