require('dotenv').config();
const express = require("express");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us1.api.mailchimp.com/3.0/lists/af7b718103/";
  const options = {
    method: "POST",
    auth: process.env.MAILCHIMP_API_KEY,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.on("error", function (error) {
    console.error(error);
    res.sendFile(__dirname + "/failure.html");
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

const port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
