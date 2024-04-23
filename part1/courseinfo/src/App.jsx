const Header = ({course}) => {
    return (
    <h1> {course} </h1>
  );

}

const Content = ({part}) => {
  const {name, exercises} = part;
  return(

    <p>
      {name} {exercises}
    </p>

  );

}

const Total = ({count}) => {

return (

<p>Number of exercises {count}</p>

);

}


const App = () => {
  const course = {
    name: 'Half Stack application development',
  
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
}
console.log(course.name);
  return (
    <div>
      <Header course={course.name} />
      <Content part={course.parts[0]} />
      <Content part={course.parts[1]} />
      <Content part={course.parts[2]} />
      <Total count={course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises} />
    </div>
  )
}

export default App
