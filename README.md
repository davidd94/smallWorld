## Project title
This is a complete social network website for terrarium/reptile hobbyist. smallWorld is meant to be used by people who love to create and display their creativity online. Members can also replicate each other's work through detailed instructions/tutorials, picture gallery, maintenance, item list, and FAQs. In essence, smallWorld is the center where anyone can proudly showcase their passionate hobby.

## Goals/Vision
To refine/refactor existing features such as (not limited to) editing tutorial section to be a smooth user experience. One of my major goal is to add an interactive photo section in each project. This photo will contain MANY if not ALL of each enclosure/terrarium setup that will populate on hover. Lots of front end work needs to be done to achieve this to ensure smoothness and to be aesthetically pleasing. To summarize, we strive to provide users the best tools in terms of easiness and user experience. Users should enjoy uploading their work online as much as creating their terrariums/enclosures, frustration-free.

## Screenshots
![Homepage](https://imgur.com/txfjykn)

![Homepage-Logged in w/ chat](https://imgur.com/eidmCtv)

![Explore Page](https://imgur.com/AINiPSM)

![Maintenance Page](https://imgur.com/Enb3CUP)

## Technologies/frameworks
<b>Built with</b>
- [Python 3.6] / [Flask]
- [JavaScript] / [jQuery], [ReactJS] + [Apollo]
- [GraphQL]
- [SQLite]

<b>NOTE:</b> jQuery was initially used to create the website. Refactoring existing jQuery code to reactJS is in progress. I am not using reactJS in combination with jQuery! I am fully aware it will cause issues if doing so as jQuery directly manipulates the DOM and reactJS works in a virtualDOM.

Other technologies and their versions can be found in the requirements.txt file.

## Installation (Windows/macOS)

If you want to test the web app yourself locally, follow the instructions below. Otherwise, you may check it out live at https://smallworld.live

<b>Step 1:</b>

Clone the repository

<b>Step 2:</b>

You must have python 3.6+ installed first before creating a virtual env. Install virtual env in your preferred location.

On macOS:

$ ../preferredlocation/python3 -m venv smallWorld

On Windows:

$ ../preferredlocation/py -m venv smallWorld

<b>Step 3:</b>

Activate your environment.

On macOS:

$ source ../preferredlocation/smallWorld/bin/activate

On Windows:

$ ../preferredlocation/smallWorld/Scripts/activate

<b>Step 4:</b>

Install all the required backend technologies/libraries using requirements.txt by 'pip install -r requirements.txt'

<b>Step 5:</b>

Install all frontend dev dependencies in the static folder (../smallworld/app/static) by entering 'npm install --development' in bash or cmd. This will install reactJS, babel compiler (for JSX), styled-components, apollo and graphQL.

<b>Step 6:</b>

Simply run the app and test away in localhost:8000! Do not use 'flask run' as flask socketIO will not be integrated into the app.
