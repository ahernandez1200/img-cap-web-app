// import config from './config.js';
import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import './App.css';

function App() {
  const [imageUrl, setImageUrl] = useState(null);
  const [b64Image, setb64Image] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    if (b64Image) {
      console.log('App working...')

      AWS.config.update({
        accessKeyId: config.awsAccessKeyId,
        secretAccessKey: config.awsSecretAccessKey,
        region: 'us-east-2',
        });

      const lambda = new AWS.Lambda({
        region: 'us-east-2',
      });

      const params = {
        FunctionName: 'CaptionPredictionLambda',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({
          image: b64Image,
        }),
      };

      console.log(b64Image)

      try {
        lambda.invoke(params, function(err, data) {
          if (err) {
            console.error(err);
          } else {
            console.log(data);
            const prediction = JSON.parse(data.Payload)['body']['caption'];
            console.log(prediction)
            setPrediction(prediction);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [b64Image]);

  const handleFileChange = async (event) => {
    event.preventDefault();

    const file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async (event) => {
      const img = event.target.result
      const base64String = event.target.result.split(',')[1];
      setImageUrl(img)
      setb64Image(base64String);
      setPrediction('Model is processing image request ...')
    };

    console.log(event.target.files[0]);
    console.log(event);
  }

  return (
    <div class='parent-container'>
      <div>
        <h1>Image Caption Generator</h1>
      </div>
      <div id=''>
        <form>
          <input onChange = {handleFileChange} type="file" name="image" />
          {/* <button onClick = {handleFormSubmit} type="submit">Upload</button> */}
        </form>
      </div>
      <div class = ''>
        {imageUrl && (
          <div id="image-container">
            <img src={imageUrl} alt="Image" />
          </div>
        )}
      </div>
      <div class = 'prediction'>
        {prediction && (
          <p>{prediction}</p>
        )}
      </div>
    </div>
  );
}

export default App;





// import React, { useState, useEffect } from 'react';
// import AWS from 'aws-sdk';
// import './App.css';

// function App() {
//   const [imageUrl, setImageUrl] = useState(null);
//   const [b64Image, setb64Image] = useState(null);


//   const handleFormSubmit = (event) => {
//     event.preventDefault();

//         // Set up AWS configuration with your environment variables
//     AWS.config.update({
//       accessKeyId: 'n',
//       secretAccessKey: 'n',
//       region: 'us-east-2',
//     });

//     const file = event.target.image.files[0];

//     const reader = new FileReader();
//     reader.readAsDataURL(file);

//     reader.onload =  (event) => {
//       const img = event.target.result
//       const base64String = event.target.result.split(',')[1];
//       setImageUrl(img)
//       setb64Image(base64String);
//       const lambda = new AWS.Lambda({
//         region: 'us-east-2',
//       });
  
//       const params = {
//         FunctionName: 'CaptionPredictionLambda',
//         InvocationType: 'RequestResponse',
//         Payload: JSON.stringify({
//           image: b64Image,
//         }),
//       };
  
//       try {
//         console.log(b64Image)
//         lambda.invoke(params, function(err, data) {
//           if (err) {
//             console.error(err);
//           } else {
//             console.log(data)
//             const result = JSON.parse(data.Payload);
//             console.log(result);
//           }
//         });
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     // const lambda = new AWS.Lambda({
//     //   region: 'us-east-2',
//     // });

//     // const params = {
//     //   FunctionName: 'CaptionPredictionLambda',
//     //   InvocationType: 'RequestResponse',
//     //   Payload: JSON.stringify({
//     //     image: b64Image,
//     //   }),
//     // };

//     // try {
//     //   console.log(b64Image)
//     //   const response = await lambda.invoke(params).promise();
//     //   console.log(response)
//     //   const data = JSON.parse(response.Payload);
//     //   console.log(data)

//     // } catch (error) {
//     //   console.error(error);
//     // }

//   };

//   return (
//     <div>
//       <form onSubmit={handleFormSubmit}>
//         <input type="file" name="image" />
//         <button type="submit">Upload</button>
//       </form>
//       {imageUrl && (
//         <div id="image-container">
//           <img src={imageUrl} alt="Image" />
//         </div>
//       )}
//     </div>
//   );
// }


// export default App;