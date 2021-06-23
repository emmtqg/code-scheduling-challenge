
# coding-challenge-front-end

Welcome to a coding challenge! 👋

Random company just signed a deal with a large real estate owner 🎉. Before we can launch our scheduling platform in their office building, we need to get a reservation system up and going.

In our backlog grooming our Product person presented the problem we are trying solve for our users:

*As an office user, I’d like to book a the large conference room for the strategy meeting and I need to find a time when it's avaiable.*

The team broke this problem down and decided to start first with this User Story:

- As an office user, I’d like to see the schedule for a selected room and date, because I need to find a time when it's available.

For this challenge, we've provided a simple application that is meant to display a list of reservations and allows the user to filter by date and room. Your job is to complete this application so that it functions as intended.

## Running the App

-  `yarn`

-  `yarn start`

## Part 1

The first objective is to take a look at the TODOs in [`App.js`](./src/App.js). We'd simply like you to "wire-up" the existing components using React [Hooks](https://reactjs.org/docs/hooks-intro.html). No need to change the UI at this stage in terms of styling or functionality, apart from hooking up the components.

To do:

- manage the state for both filters (`DatePicker` & `DropDownSelect`)

- fetch a list of reservations from this endpoint: xxxxxxxx

- populate `DropDownSelect` with options based on the rooms you get back from the endpoint (e.g. "Room A", "Room B", ...)

- pass a filtered version of the reservations you get back to `ReservationList`

After this step, the user should be able to change the value of both filters, and they should only see reservations that match their filters.

*EMM:
In leau of an API, a .json file has been generated with example json data that would be received from an actual API call.*


### Explain your approach to Part 1

*EMM:*

 As **Part 1** involved fetching external data, I thought a generic fetch hook might be useful if other fetches are needed for further endpoint queries with any enhancement requests_(for example, if a reservation was created, editted or deleted, typical CRUD operations)_ An additional data state element was added to enable any returned data initialization that might be necessary.

**Api.js** orchestrates:
* the API fetch, await and response processing
* dropdown room list initialization from API response to load all unique rooms available
* manages filter changes via useEffects hooks triggered on changes in the values of either the  dropdown list or selected calendar date. 

A list of availableRooms isloaded once during the **API response** processing. An additional "Any Room" is added as a default option to allow viewing of all the rooms' reservations on a particular day.

The original reservationList response is maintained for subsequent filtering requests. Once a room is selected, that room choice remains in effect even if the selected calendar date changes. This could easily be modified to default to the new date choice displaying all the reservations, an "Any Room" dropdown selection.  I chose not to do this because as a consumer of this type of filtering, if I need to book a particular room because of some preference that I might have, it mightn't be an optimal user experience to have to select the preferred room every time.

**Additional Notes:**
1. I extracted the API URL to an .env file for future extensibility. Additional the text used for the "Any Room" option is also defined there to facilitate updating, internationalization, etc.. I did not add the .env file to .gitignore intentionally to facilitate this demo.
2. All start/end dates are assumed to be the same. If this functionality needs to be extended, the end date processing (in the reservation listing component and the utility function can include the end date when the end property in the reservation lisan issue I had loadt is parsed.
3. The Map constructor declarations in the App.js, ReservationList.js and the utils.js modules have the eslint check for undefined variables disabled for those lines. I would need to investigate further why this is firing when creating a new Map.To 
4. The "No reservations found" message by the RegistrationList component will ask "Would you like to make a reservation?" if the selected reservation is today or any day forward.
5. Interesting Date challenges surfaced when dealing with checking for past reservation dates in the evening local time as the local time here (EST) is 5 hours behind UTC time. I chose not to use moment JS due to its heaviness, but a ligher and efficient date-fns, [date-fns.org](https://date-fns.org/)). This alleviated an issue that occurred when filtering the reservations by date due to the reservationList UTC time conversion (some of the reservations being checked were showing in the next calendar day. The date-picker component also uses date-fns, so consistency was a factor as well.
6. I tinkered with using an ease in image transistion (either with a hook to detect the image is loaded or a [react-smooth-image](https://reactjsexample.com/butter-smooth-loading-non-jumping-images-for-react-that-just-work/) plugin). But less obtrusive image loading methods are usually available working on a production level application in a given production environment.


  
## Part 2
Your next job is to make the list of reservations look a little nicer. The designer on our team made some mock-ups for the desktop and mobile UI. Take a look at the TODO in [`ReservationList.js`](./src/ReservationList.js) and try to match Ryan's mock-ups below. Your design should be responsive, using a css breakpoint to switch between the desktop and mobile layouts.

  
  

Desktop:
<img  src="public/imgs/mock-up-desktop.png"  alt="desktop" />

Mobile:
<img  src="public/imgs/mock-up-mobile.png"  alt="mobile"  width="300"/>

Please don't worry about making it a pixel-perfect match with the designs! As Devs we collaborate closely with Ryan and it's a give and take.

Feel free to use whatever approach to styling you wish. No need to mirror what is already in the project. Some approaches that we consider valid: 

-  [Styled Components](https://styled-components.com/)
-  [React-JSS](https://cssinjs.org/react-jss/?v=v10.6.0)
-  [Tailwind](https://tailwindcss.com/)
- SASS/LESS
- CSS Modules
- or just plain CSS

  

### Explain your approach to Part 2
  
*EMM:*

I utilized Tailwind for the project styling since I've always wanted to give it a whirl on a smaller endeavor. I love it! Initially, I was hesistant with the utility based class approach in maintaining a consistent look and feel within a project, but I think with react and react-thinking, coupled with the ability to organize consistent spacing via the tailwind config file, it makes sense for reusable components for even larger projects. It was very easy to come up to speed quickly and utilize their helpful documentation.

#### Reactive Styling

Tailwind makes customizing breakpoint very straighforward with their configuration file. Once defined, your customized breakpoint can be utilized just as any of the predefined tailwind breakpoinks. I found I wanted to utilize a smaller screen than Tailwind's default breakpoint at 640px width to switch from a flex row layout for each room reservation details from the mobile first default column layout so the image's apect ratio would not get overly distorted. I also appreciated the fact that mobile-first design and coding makes coding larger screens much less painful. 

Along the same lines, I diverted slightly to stacking the app-filters on smaller screens to maintain the width of the date component. That could be easily mitagated to have the date text input area based on a percentage to the flex-row displaying both filters. My initial thought was that this approach would be more extensible if other filters are added. Would have a conversation with Ryan regarding whether or not the approach was viable.

I'd love to experiment further with Tailwind's grid layout capabilities!
  

## Part 3

For this last step, we'd like to try and understand how you approach testing. Our product person already has a bunch of reservations related User Stories lined up. In the backlog grooming, Rachel pointed out that we should add some good test coverage now, since we'll likely add more complexity to our reservation app in the future.

We've started working on a util called `isScheduleConflict` to check for reservation conflicts. `isScheduleConflict` takes a list of reservations and returns `true` if any reservation in the list conflicts with another in the list (see `utils.js` for more details). Your job is to complete this util and add more test coverage. Look for the TODOs in [`utils.js`](src/utils.js) and [`utils.test.js`](src/utils.test.js) and use `yarn test` to execute the tests.

Assumptions you can make:

-  `reservations` will always be an array of valid reservations
- A valid reservation always has a start/end time and the end time will always be after the start time
- Do NOT hook up the util to the user interface

NOTE: Don't worry about the efficiency of your solution:

- If you know an efficient solution, we'd love to see it and hear why you favor it.
- However, we are more focused on readable and maintainable code.

### Explain your approach to Part 3

*EMM:*

Interesting function and, I realize normally for something like this, efficiency would be a concern, but thank you for scoping that. In writing these tests, I tried to used a TDD approach which worked out well and I gained, as usual, for including test in the development cycle. I discovered a surprise with having both reservations start out at the exact same time so was able to update by reservation overlap test to test for '>=' and save the day!

Initially, I included various reservation lists for 'no conflic', 'conflict', and just 'touching' scenarios in the actual test. I extracted them to a /test-data folder with a view towards expanding on the testcases for all the components. While the actual times can be directly manipulated in the test file, I left the categoried data files for testing other components.

I also used test data which had a number of reservations sitting between the conflicted reservations to show that the reservations need not be sorted. I created a Map (essentially mini hash table) to load the reservations by a Date key which stored the start/end times as an array of start end reservation times for that day.  This eliminated traversing all the elements already processed for the next iteration through the resrevations. If the Map contained the reservation date, only the reservations already processed on that day would need to be checked. If the day was not already in the Map, it would just need to define a new key and load its start/end time and the next iteration would continue.

An obvious enhancement to this functionality would be to include the room name in the reservation overlap check. People management may not be happy end users if they could only have one meeting at a time during the day while having multiple conference rooms available (though productivity wise it could offer advantages **(?)**).

## One last thing...

Write up a few notes about your approach to each Part in the README sections above. Finally, search the repo for `TODO:`. If you see no search results, then you are done! 👏
