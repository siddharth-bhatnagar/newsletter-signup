const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
 
    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    }
    
    mailchimp.setConfig({
        apiKey: 'b791022a0bc4635c1b9419c119c334e8-us2',
        server: 'us2'
    });
    
    const listId = 'ca0e1e0825';
 
    const run = async () => {
        const response = await mailchimp.lists.batchListMembers(listId, {
          members: [{
              email_address: email,
              status: "subscribed",
              merge_fields: {
                  FNAME: firstName,
                  LNAME: lastName
              }
          }],
        }).then(responses => {
            // console.log(responses);
            if(responses.id !== "") {
                res.sendFile(__dirname+"/success.html");
            } 
          }).catch(err => {
                res.sendFile(__dirname+"/failure.html");
                console.log(err);
          });
      
      };
      
      run();
 
});

app.post("/failure.html", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => console.log("Server started on port 3000."));

// b791022a0bc4635c1b9419c119c334e8-us2 -- api key
// unique id ca0e1e0825
