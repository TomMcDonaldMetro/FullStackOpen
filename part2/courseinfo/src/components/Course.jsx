const Header = (course) => {
    return (
    <h1> {course.name} </h1>
  );
  
  }
  
  const Content = (content) => {
    console.log(content, "content")
  const {name, exercises} = content;
  return(
  
    <p>
      {name} {exercises}
    </p>
  
  );
  
  }
  
  const Total = (props) => {
    console.log(props, "total")
  const arr = props.props;
  const sumValue = arr.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.exercises
  } , 0);
  return (
  
  <b>Number of exercises {sumValue}</b>
  
  );
  
  }
  
  const Course = ({course}) => {
    console.log(course, "Course")
    const arr = course.parts;
    console.log(arr, "partS");
    return (
      <div>
        <Header name={course.name} />
        {arr.map(value=> <Content key={value.id} name={value.name} exercises={value.exercises} />)}
        
        <Total props={course.parts} />
      </div>
    )
  }

  export default Course