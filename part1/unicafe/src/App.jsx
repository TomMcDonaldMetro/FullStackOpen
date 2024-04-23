import { useState } from 'react'

const Display = (props) => {
  
  return (
    <h1>{props.title}</h1>
  )
}

const Button = ({handleClick, name}) => {
  return (
    <button onClick={handleClick}> 
      {name}
    </button>
  )
}

const average = (good, bad) =>{
  console.log(good, bad);
  return good * 1 + bad * -1;
}

const StatisticLine = ({text, value}) => {

  return (
    <tr>
      <td>{text}</td><td>{value}</td>
    </tr>
  )
}

const Statistics = ({good,neutral,bad}) => {
 
  const all = good + neutral + bad;
  console.log(all);
  const avg = average(good,bad) / all;
  if(all > 0){
    return (
      <table>
        <tbody>
        <StatisticLine text={"good"} value={good} />
        <StatisticLine text={"neutral"} value={neutral} />
        <StatisticLine text={"bad"} value={bad} />
        <StatisticLine text={"all "} value={all} />
        <StatisticLine text={"average"} value={avg} />
        <StatisticLine text={"positive"} value={(good / all * 100) + "%"} />
        </tbody>
      </table>
    )
  } else{
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const title = "Give Feedback"
  return (
    <div>
      <Display title={title} />
      <Button handleClick= {()=>{setGood(good + 1)}} name={"good"} />
      <Button handleClick= {()=>{setNeutral(neutral + 1)}} name={"neutral"}  />
      <Button handleClick= {()=>{setBad(bad + 1)}} name={"bad"}  />
      <Display title={"Statistics"} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App