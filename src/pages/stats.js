import React from 'react';

const  Stats = () => {
  return (
    <div>
      <h1 className='stats-title'>Dashboard</h1>
      <p>This is basic data of accuracies when the 0.33 (1/3)s time limit was chosen (done using powerBI) </p>
      <img src="image.png" style={styles.main_image}/>
      <p> Data collected from the memory test has been stored in a database (with no personally identifying information) stored.
          This data shows that, on average, when controlling for the time limit chosen for each user, at 0.33s, the 
          average accuracy is highest when a image is shown with related word (condition 1), and lowest when a 
          image is shown with an unrelated word. The accuracy measures, for each condition, how many words out of 10 a user was 
          able to correctly type after seeing it.
      </p>
      <p>Last updated at 6am Eastern Time, June 4th</p>
   </div>
  );
}


export default Stats;

//styles 

const styles = {
  main_image: {
    width:"600px",
    objectFit: 'contain',
  },
}