var chemistryTableInitialStr = '<table class="topicListBox innerPage"><tbody><tr><td class="headingBox" style="text-align: center; padding: 10px;" colspan="2"><b><a href="https://byjus.com/chemistry/chemistry-article/">More Chemistry Articles</a></b></td></tr>';
var chemistryTableFinalStr = '</tbody></table>';
var chemistryTabledummyStr = '<td class="contentBox" style="text-align: center;"><a href="%link%">%title%</a></td>';

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

const mysql = require('mysql');
const express=require('express');
var bodyParser=require('body-parser');
const app=express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test"
});

app.post('/',(req,res)=>{
var jumpValue = 4;
pageTitle=req.body.title;
if(!pageTitle)
{
	res.status(404).send({
                status: false,
                message: "title not found"
    })
    return;
}
con.connect(function(err) {
  if (err) throw err;
  //console.log(pageTitle);
  con.query("SELECT * from wp_posts where post_status='publish'", function (err, result, fields) {
    if (err) throw err;
    console.log(result.length);
    if(result.length===0)
    {
    	res.status(404).send({
                status: false,
                message: "no data in the table"
    	})
    	//return;
    }
    var finalStr = chemistryTableInitialStr.replace('%category%', "Related");
    var index = findIndexOf(pageTitle, result);
    console.log(`found index= ${index}`);
  	for(i=0;i<4;i++)
	{
		if(i%2===0)
		finalStr += '<tr>'
		var nextIndex = (index + ((i + 1) * jumpValue)) % result.length;
		var dummyStr = chemistryTabledummyStr;
        dummyStr = dummyStr.replaceAll('%title%', result[nextIndex].post_title);
        dummyStr = dummyStr.replaceAll('%link%', result[nextIndex].guid);
        finalStr += dummyStr;
        if (i % 2 !== 0)
        finalStr += '</tr>'
        console.log(`next index= ${nextIndex}`);
  		//console.log(result[i].post_title);

  	}
  	finalStr += chemistryTableFinalStr;
  	res.status(200).send({
                    success: 'true',
                    message: finalStr
     });
    
  });
});
})

function findIndexOf(title, result) {
    for (i = 0; result.length; i++) {
        if (result[i].post_title === title)
            return i;
    }
    return -1;
}

app.listen(8000);