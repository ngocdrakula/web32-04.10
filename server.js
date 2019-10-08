const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
//router
app.get('/',(request, response)=>{//BTVN{
    const fileData = fs.readFileSync("question.json","utf-8");
    var questionDetail = fs.readFileSync("views/questionDetail.html","utf-8");
    const questionList = JSON.parse(fileData);
    const randomIndex = Math.floor(Math.random()*questionList.length);
    const question = questionList[randomIndex];
    questionDetail = questionDetail.replace(/questiontext/g, question["content"]).replace(/totalcount/g, (question["yes"] + question["no"])).replace(/yescount/g, question["yes"]).replace(/nocount/g,question["no"]);
    response.send(questionDetail);
});//}ENDBTVN
app.get('/ask',(request, response)=>{
    response.sendFile(__dirname+"/views/ask.html");
});
app.get('/question',(request, response)=>{
    response.sendFile(__dirname+"/views/questionDetail.html");
});
app.get('/question/:questionIndex',(request, response)=>{
    const fileData = fs.readFileSync("question.json","utf-8");
    var questionDetail = fs.readFileSync("views/questionDetail.html","utf-8");
    const questionList = JSON.parse(fileData);
    const questionIndex = request.params.questionIndex;
    if(questionList.length>=questionIndex){
        const question = questionList[questionIndex-1];
        questionDetail = questionDetail.replace(/questiontext/g, question["content"]).replace(/totalcount/g, (question["yes"] + question["no"])).replace(/yescount/g, question["yes"]).replace(/nocount/g,question["no"]);
        response.send(questionDetail);
    }
    else response.send(`Chưa có câu hỏi thứ ${questionIndex}. Hãy thêm câu hỏi`);
});
app.post('/add-question',(request, response)=>{
        const questionContent = request.body.question;
        const fileData = fs.readFileSync("question.json","utf-8");
        const questionList = JSON.parse(fileData);
        questionList.push({
            content: questionContent,
            yes: 0,
            no: 0
        });
        fs.writeFileSync("question.json", JSON.stringify(questionList));
        response.redirect(`/question/${questionList.length-1}`);
});
// app.get('/index.css',(request, response)=>{
//     response.sendFile(__dirname+"/Folder/index.css");
// });
app.use(express.static("Folder"));
app.listen(6969, (err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Server OK!");
    }
}); 