import { useEffect, useState } from "react";
import axios from 'axios';

export default function Trivial() {
    const url = 'https://opentdb.com/api.php?amount=10&type=multiple';
    const [questions, setQue] = useState( [] );

    // questions.

    useEffect(()=> {
        axios.get( url ).then( res => {
            console.log(res.data.results);
            // results.category
            // .correct_answer
            // .qestion
            // .incorrect_answers[]
            // make .answers[][0] - answer [1] - correct / incorrect (true / false)
            const newQuestions = [];
            for (const data of res.data.results) {
                newQuestions.push( {
                    category: data.category,
                    question: data.question,
                    answers: createArrayOfAnswers(data.correct_answer, data.incorrect_answers)
                 } );
            }
            //console.log( answers );
            setQue( newQuestions );
        })
    }, [])

    return (
        <div>
            { questions.map( (data, index)=> <div key={index} className="trivia_item">
                <p>Categoria: {data.category}</p>
                <p>{decodeHtmlCharCodes(data.question)}</p>
                { data.answers.map( (answer, index2) => <div key={index2}><a onClick={()=> answerClicked(index, index2)}>{answer.answer}</a></div> ) }
            </div>
            )}
        </div>
    );

    function answerClicked(index, id) {
        console.log( questions[index].answers[id].isCorrect );
    }

    function createArrayOfAnswers(correct, incorrect) {
        let newArray = [];
        let random = Math.floor(Math.random() * 4);
        console.log( "random is:",random );
        for (let i=0; i<4; i++) {
            if(i == random) {
                newArray.push( { answer: correct, isCorrect: true } );
            } else {
                newArray.push( { answer: incorrect.splice(0,1)[0], isCorrect: false } );
            }
        }
        return newArray;
    }
}

function decodeHtmlCharCodes(str) { 
    return str.replace(/(&#(\d+);)/g, function(match, capture, charCode) {
        return String.fromCharCode(charCode);
    });
}