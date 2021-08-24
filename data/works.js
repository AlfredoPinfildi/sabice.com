import Work from "@models/Work";

const works = [
  new Work(
    {
      small: "ALI",
      medium: "Alivu",
      large: "Alivu",
    },
    "alivu",
    "https://user-images.githubusercontent.com/41680436/117030182-a502e380-acff-11eb-975f-ba93e6db80b3.jpg",
    "2016",
    ["branding", "naming", "packaging", "editorial"]
  ),

  new Work(
    {
      small: "BON",
      medium: "Bonrè",
      large: "Bonrè",
    },
    "bonre",
    "https://user-images.githubusercontent.com/41680436/117030186-a59b7a00-acff-11eb-8a5b-d6a82c9e507a.jpg",
    "2017",
    ["branding", "naming", "packaging"]
  ),

  new Work(
    {
      small: "DUM",
      medium: "Dumbo",
      large: "Dumbo",
    },
    "dumbo",
    "https://user-images.githubusercontent.com/41680436/117030190-a6341080-acff-11eb-914d-4d11ed4eac49.jpg",
    "2016",
    ["branding"]
  ),

  new Work(
    {
      small: "TRF",
      medium: "Tre Farine",
      large: "Tre Farine",
    },
    "tre_farine",
    "https://user-images.githubusercontent.com/41680436/117030236-af24e200-acff-11eb-8b65-d61c59b3811e.jpg",
    "2015",
    ["branding", "naming", "editorial"]
  ),

  new Work(
    {
      small: "COC",
      medium: "Coce",
      large: "Coce",
    },
    "coce",
    "https://user-images.githubusercontent.com/41680436/123079519-51b63300-d41c-11eb-83b3-1aaaf8849b07.png",
    "2019",
    ["branding", "naming"]
  ),

  new Work(
    {
      small: "INX",
      medium: "Inixio",
      large: "Inixio",
    },
    "inixio",
    "https://user-images.githubusercontent.com/41680436/123079522-51b63300-d41c-11eb-91c3-b82520e3caea.png",
    "2020",
    ["branding", "naming", "video_presentation"]
  ),

  new Work(
    {
      small: "SMO",
      medium: "Smoky Joe",
      large: "Smoky Joe",
    },
    "smoky_joe",
    "https://user-images.githubusercontent.com/41680436/117030200-a7653d80-acff-11eb-96bc-60dd925cf0fd.jpg",
    "2019",
    ["branding", "editorial"]
  ),

  new Work(
    {
      small: "FLÒ",
      medium: "FloraFlò",
      large: "FloraFlò",
    },
    "floraflo",
    "https://user-images.githubusercontent.com/41680436/117030192-a6341080-acff-11eb-9fd1-8743388de0c1.jpg",
    "2018",
    ["branding", "video_presentation"]
  ),

  new Work(
    {
      small: "BKH",
      medium: "BlockHouse",
      large: "BlockHouse",
    },
    "blockhouse",
    "https://user-images.githubusercontent.com/41680436/117030185-a59b7a00-acff-11eb-8f40-61a9932da937.jpg",
    "2019",
    ["branding", "video_presentation"]
  ),

  new Work(
    {
      small: "ONL",
      medium: "Onlab",
      large: "Onlab",
    },
    "onlab",
    "https://user-images.githubusercontent.com/41680436/117030199-a7653d80-acff-11eb-954e-c9055800bdc4.jpg",
    "2020",
    ["branding", "video_presentation"]
  ),

  new Work(
    {
      small: "MEM",
      medium: "Memorya",
      large: "Memorya",
    },
    "memorya",
    "https://user-images.githubusercontent.com/41680436/123079523-524ec980-d41c-11eb-9688-b9730ec19754.png",
    "2020",
    ["branding", "naming", "packaging"]
  ),

  new Work(
    {
      small: "LUP",
      medium: "Lupi",
      large: "Olio Lupi",
    },
    "olio_lupi",
    "https://user-images.githubusercontent.com/41680436/117030176-a46a4d00-acff-11eb-894a-94fe271103cc.jpg",
    "2017",
    ["rebranding", "packaging"]
  ),

  new Work(
    {
      small: "COL",
      medium: "Rajano",
      large: "Colle Rajano",
    },
    "colle_rajano",
    "https://user-images.githubusercontent.com/41680436/123079509-4e22ac00-d41c-11eb-9a97-0e14dd1c2c0e.png",
    "2017",
    ["rebranding", "video_presentation"]
  ),

  new Work(
    {
      small: "CAS",
      medium: "Castello",
      large: "Castello di Faicchio",
    },
    "castello_di_faicchio",
    "https://user-images.githubusercontent.com/41680436/117030151-a0d6c600-acff-11eb-8880-c95fb1f41d99.jpg",
    "2018",
    ["rebranding", "naming", "editorial"]
  ),

  new Work(
    {
      small: "FIB",
      medium: "Fiber",
      large: "We are Fiber",
    },
    "we_are_fiber",
    "https://user-images.githubusercontent.com/41680436/123079517-511d9c80-d41c-11eb-9f13-ffff545bca11.png",
    "2018",
    ["rebranding", "video_presentation"]
  ),

  new Work(
    {
      small: "EFF",
      medium: "Efficacemente",
      large: "Efficacemente",
    },
    "efficacemente",
    "https://user-images.githubusercontent.com/41680436/117030173-a3d1b680-acff-11eb-90f5-d984ca1befaf.jpg",
    "2020",
    ["rebranding", "video_presentation"]
  ),

  new Work(
    {
      small: "MET",
      medium: "Meeters",
      large: "Meeters",
    },
    "meeters",
    "https://user-images.githubusercontent.com/41680436/117030178-a502e380-acff-11eb-87f0-479b7d0ff958.jpg",
    "2020",
    ["rebranding", "video_presentation"]
  ),

  new Work(
    {
      small: "ECO",
      medium: "Ecoverso",
      large: "Ecoverso",
    },
    "ecoverso",
    "https://user-images.githubusercontent.com/41680436/117030169-a3392000-acff-11eb-8cc6-ec5db7af0ed3.jpg",
    "2020",
    ["rebranding", "naming", "video_presentation"]
  ),

  new Work(
    {
      small: "FAR",
      medium: "Farinò",
      large: "Farinò",
    },
    "farino",
    "https://user-images.githubusercontent.com/41680436/117030175-a46a4d00-acff-11eb-880d-c6b68a7d1749.jpg",
    "2016",
    ["naming", "packaging"]
  ),

  new Work(
    {
      small: "GRA",
      medium: "Diario",
      large: "Diario della Gratitudine",
    },
    "diario_della_gratitudine",
    "https://user-images.githubusercontent.com/41680436/117030167-a3392000-acff-11eb-9550-4f8068ee2386.jpg",
    "2020",
    ["editorial"]
  ),

  new Work(
    {
      small: "CLE",
      medium: "Clessidra",
      large: "Clessidra { Typeface }",
    },
    "clessidra",
    "https://user-images.githubusercontent.com/41680436/123079502-4d8a1580-d41c-11eb-8f24-9f282d4a63bf.png",
    "2020",
    ["bonus_track"]
  ),

  new Work(
    {
      small: "C19",
      medium: "Covid-19",
      large: "Covid-19 { Posters }",
    },
    "covid_19",
    "https://user-images.githubusercontent.com/41680436/123079515-4fec6f80-d41c-11eb-931c-2d8c0a3ea8de.png",
    "2020",
    ["bonus_track"]
  ),

  new Work(
    {
      small: "365",
      medium: "Treseicinque",
      large: "Treseicinque",
    },
    "treseicinque",
    "https://user-images.githubusercontent.com/41680436/123079524-524ec980-d41c-11eb-8c33-792b4b436215.png",
    "2021",
    ["branding", "packaging"]
  ),

  new Work(
    {
      small: "LAZ",
      medium: "Lazio",
      large: "Lazio { Contest }",
    },
    "lazio",
    "https://user-images.githubusercontent.com/41680436/123080426-30a21200-d41d-11eb-956e-6fbacc40ac29.png",
    "2014",
    ["bonus_track"]
  ),
];

export default works;
