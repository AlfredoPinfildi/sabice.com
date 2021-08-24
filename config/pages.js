const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");
const rootPath = path.resolve(__dirname, "..");

const generateHtmlPlugin = (title) => {
  return new HtmlWebpackPlugin({
    title,
    filename: `${title.toLowerCase()}/index.html`,
    template: path.resolve(
      rootPath,
      `/pages/${title.toLowerCase()}/index.html`
    ),
  });
};

const populateHtmlPlugins = (pagesArray) => {
  res = [];
  pagesArray.forEach((page) => {
    res.push(generateHtmlPlugin(page));
  });
  return res;
};

const pages = populateHtmlPlugins([
  "About",
  "Credits",
  "Illustratore",
  "Illustrazioni",
  "Designer",
  "Lavori",
  "Offline",
  "404",
  "lavori/alivu",
  "lavori/blockhouse",
  "lavori/bonre",
  "lavori/castello_di_faicchio",
  "lavori/clessidra",
  "lavori/coce",
  "lavori/colle_rajano",
  "lavori/covid_19",
  "lavori/diario_della_gratitudine",
  "lavori/dumbo",
  "lavori/ecoverso",
  "lavori/efficacemente",
  "lavori/farino",
  "lavori/floraflo",
  "lavori/inixio",
  "lavori/lazio",
  "lavori/meeters",
  "lavori/memorya",
  "lavori/olio_lupi",
  "lavori/onlab",
  "lavori/smoky_joe",
  "lavori/tre_farine",
  "lavori/treseicinque",
  "lavori/we_are_fiber",
]);

module.exports = pages;
