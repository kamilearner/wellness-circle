# Wellness Circle App for Women and Girls

https://github.com/kamilearner/wellness-circle


## Overview 

The Women's Wellness Circle App is a comprehensive platform designed to empower women by providing personalised health resources, reminders, and community support. This app addresses gender equity challenges as outlined in the UN Sustainable Development Goal 5, focusing on ensuring healthcare access for women and girls.

### MVP (Minimum Viable Product)

#### User Account and Register/Login System

Secure login with email and password.

### Health Features

Recommended Screenings: Personalised health screening recommendations based on age and location. It also gives the details of nearby clinics/health providers based on location given.
Symptoms Checker: Check symptoms and receive health insights with AI-powered recommendations. Sends prompts to Gemini for enhanced symptom analysis.
Support Groups: Connect with others, share experiences, and find support in communities.
Period Tracker: A tool for the female user to track their menstrual cycle and set reminder for health check ups.


## Run on a local machine

To set up the Women's Wellness App locally, follow these steps:

Clone the repository:

   ```
   git clone https://github.com/kamilearner/wellness-circle
   ```

Navigate to the project folder:

   ```
   cd wellness-circle
   ```

Install dependencies:

   ```
   npm install
   ```

Start the app:
   ```
   npm run dev
   ```

This will concurrently run:
the back end (default: localhost:5000)
the front end (default: localhost:5173)

Open the front end link to see the app.
Deployment in production
The development host is a Macbook with MacOS Sonoma 14.6.1.
Git version 2.47.0
Node version 23.1.0

Back end (Heroku): https://wellness-circle-d37af3877351.herokuapp.com/
Front end (Netlify): https://nimble-paletas-0a8e8f.netlify.app/ (the actual app)

To deploy in production, there are two separate processes:

Back end:
First time setup
brew tap heroku/brew && brew install heroku\n
heroku login
heroku buildpacks:set https://github.com/timanovsky/subdir-heroku-buildpack --app wellness-circle
heroku buildpacks:add heroku/nodejs
heroku config:set PROJECT_PATH=server --app wellness-circle
heroku git:remote -a wellness-circle
Deploy
git push heroku main
Front end:
First time setup
npm install -g netlify-cli
netlify login
Deploy
npm run build
netlify deploy --prod


## Usage

		Sign up to create an account or log in with an existing one.
		Access personalised health resources/reminders and connect with support groups.
		Use the Symptom Checker to get recommendations based on symptoms.

## Technologies Used

Frontend: React, HTML, CSS, NextJS
Backend: Node.js, Express
For development I use Vita
Database: Sqlite
Authentication: Email/Password, JWT
Google Products used: Gemini API

## Future Improvements

Integration with Fitbit/Google Pixel watch API to get dditional health insights tailored to user needs and profile history. Predicting health risk using wearable device data, such as Fitbit, Google pixel watch, using API. By using all of the data like sleep, walking exercise, your heart rate, you could potentially better identify what risks people are prone to or to identify certain patterns.

Add a personalised treatment recommendation feature, so that it takes into account your medical records, your drug information, your previous records, which could be beneficial and save doctor’s time, before the doctor comes to see you in the office.

More personalised health reminders based on user feedback. Sync the period tracker with the Fitbit/Google pixel watch/Health Connect data.

Expanded features for support groups to enhance community engagement. Include functionality to create groups, more CRUD operations.

Use Google Maps API for the current location as well as the proposed nearby medical providers.

Clustering users data to gain insights, use a clustering algorithm in order to group patient data based on demographics , location, time of year, symptoms. This could be used to identify certain trends or patterns based on demographics, age, certain symptoms.

This app not only serves as a tool for personal health management but also aligns with global efforts to promote gender equality and empower women. By leveraging technology, the Women's Wellness Circle App aims to create a supportive environment where women can thrive in their health journeys.
