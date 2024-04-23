import { useState } from 'react'

const randomNumber = max => {
  return  Math.floor(Math.random() * max);
}


const Display = ({props}) =>{
 console.log(props);
  return (
    <div>{props}</div>
  )
}

const Title = ({props}) => {
  return (
    <h1>{props}</h1>
  )
}

const Button = ({props, text}) => {

  return (
    <button onClick={props}>{text}</button>
  )
}



const App = () => {
  const [selected, setSelected] = useState(0)
  const [mostVotes, setMostVotes] = useState(0);
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const starter = Array.apply(null, new Array(anecdotes.length)).map(Number.prototype.valueOf,0);
  const [votes, setVotes] = useState(starter);


  const setNumber = () => {
    const val = randomNumber(anecdotes.length);
    console.log(val);
    setSelected(val);
  }

  const handleVote = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
  }

  const getMostVotes = (votes) => {
    console.log("votesss")
    let mostVotes = 0;
    let index = 0;
    
    const copy  = [...votes];
    for(let i = 0; i < copy.length; i++){
      if(copy[i] > mostVotes){
        mostVotes = copy[i];
        index = i;
      }
      
      }
      return index;
      
    }

   

  return (
    <div>
      <Title props="Anecdote of the Day" />
      <Display props={anecdotes[selected]}/>
      <Display props={"has " + votes[selected] +" votes"} />
      <Button props={handleVote} text="Vote" />
      <Button props={setNumber} text="Next anecdote" />
      <Title props="Anecdote with the most votes" />
      <Display props={anecdotes[getMostVotes(votes)]}/>
      <Display props={"has " + votes[getMostVotes(votes)] +" votes"} />
    </div>
  )
}

export default App