import styled, { ThemeProvider } from "styled-components";
import React from 'react';
import * as yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Button, TextField, Select, crukTheme } from "@cruk/cruk-react-components";
import axios from "axios";

const SiteWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;


class App extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      n: 10,
      disabled: false,
      items: []
  };
  
  this.getNasaData = this.getNasaData.bind(this);
}

getNasaData = (values) => {
 this.setState({disabled: true, items: []})
  axios.get(`https://images-api.nasa.gov/search?keywords=${values.keywords}&media_type=${values.mediaType}&year_start=${values.yearStart}`)
    .then(data => {
       let items = data.data.collection.items.slice(0, this.state.n);
       for(var i=0; i < items.length; i++ ){
         fetch(items[i].href)
         .then(response => response.json())
         .then( log => this.setState({items: [...this.state.items, log[0]], disabled: false}))
       }
       console.log(this.state.items.length)
    });
   
 
  }

 

render() {
  const formSchema = yup.object().shape({
    keywords: yup.string()
      .min(2, 'Keywords must be between 2 and 50 characters.')
      .max(50, 'Keywords must be between 2 and 50 characters.')
      .required('Required'),
    mediaType: yup.string()
      .required('Please select a media type.'),
    yearStart: yup.date().nullable()
      .max(new Date().getFullYear(), "Year must not be in the future")
      .typeError("Please enter a valid year.")
  })
  return (
    <ThemeProvider theme={crukTheme}>
      <SiteWrapper>
        <div>
          <h1>CRUK technical exercise - React</h1>
        </div>
        <div>
          <Formik
            validateOnChange
            initialValues={{
              keywords: "",
              mediaType: "",
              yearStart: "",

            }}
            validationSchema={formSchema}
            onSubmit={(values) => {
              this.getNasaData(values)
            }}>
            {() => {
              return (
                <Form>
                  <Field name="keywords">
                    {({ field }) => (
                      <>
                        <TextField
                          label="Keywords" 
                          type="text"
                          isValid={true}
                          required
                          {...field}
                        />
                        <ErrorMessage name="keywords"/>
                      </>
                    )}
                  </Field>
                  <Field as={Select} label="Media Type" required name="mediaType">
                      <option value="" selected disabled hidden></option>
                      <option value="audio">Audio</option>
                      <option value="video">Video</option>
                      <option value="image">Image</option>
                  </Field>
                  <Field name="yearStart">
                    {({ field }) => (
                      <>
                        <TextField
                          label="Year start (optional)" 
                          type="text"
                          {...field}
                        />
                        <ErrorMessage name="yearStart"/>
                      </>
                    )}
                  </Field>
                  

                  <Button disabled={this.state.disabled} type="submit">{this.state.disabled ? "Submitting..." : "Submit"}</Button>
                  
                </Form>
                
              )
            }}
          </Formik>
        </div>
        <div>
        <div>
                {this.state.items.map((item, index) => { return <div><a href={item} target="_blank" rel="noreferrer">Result {index + 1} </a></div>})}
                </div>
        </div>
      </SiteWrapper>
    </ThemeProvider>
  );
 }
} export default App;
