<h1 align="center">NPS-API</h1>

<h3>Hi everyone! This is a NPS (Net Promoter Score) API, developed during a #NextLevelWeek</h3>

Next Level Week (or [#NLW](https://twitter.com/hashtag/nlw?src=hashtag_click)) is a online event to introduce people to a developer's world. The NLW is produce by [Rocketseat](https://rocketseat.com.br/).

Each edition presents a different application. The 4th edition presents 3 trails: #NodeJs, #ReactJS and #Elixir. This is NodeJS trail, where we produce the NPS-API.

<h2>How it Works?</h2>

First of all, its necessary create a survey, and then, create a user. With those data, we can provide a survey for users, sended via email

See the Entity and Relationship Diagram below:

![Entity and Relationship Diagram](https://github.com/IagooCesaar/cursos-rocketseat-nlw-04-node/blob/main/.github/DER.png?raw=true)

<h2>Try it yourself</h2>

Take the steps to get and execute the NPS-API:

1. First, you need to download this source code or clone with git:

```bash
git clone git@github.com:IagooCesaar/cursos-rocketseat-nlw-04-node.git

// or

git clone https://github.com/IagooCesaar/cursos-rocketseat-nlw-04-node.git
```

2. If you clone this repository, you may change to directory cursos-rocketseat-nlw-04-node with `cd cursos-rocketseat-nlw-04-node` otherwise, you can do it manually

3. On the repository directory, you will need to install dependencies of this project. To do so, you can use `yarn`or `npm` on your favorite terminal, like this:

```bash
yarn install
```

4. On the package.json file, you can checkout some scripts. Here we will use just two: "dev" and "test".

- dev: will run the application in developer's mode

- test: will execute script of tests

To execute those, you can do like that:

```bash
yarn dev

// or

yarn test
```

The result should be like this examples:

- dev script result's:

  ![dev script result's](https://github.com/IagooCesaar/cursos-rocketseat-nlw-04-node/blob/main/.github/dev-script-result.jpg?raw=true)

- test script result's:

  ![test script result's](https://github.com/IagooCesaar/cursos-rocketseat-nlw-04-node/blob/main/.github/test-script-result.jpg?raw=true)

To next steps below, we need to execute `dev script`, because we will introduce the app's routes.

<h2>App's routes</h2>

After run dev's script, the application will be running on 0.0.0.0:3333. So, we can access with http://localhost:3333/. It's recommended to use [Insomnia](https://insomnia.rest/download/) as http client to test app's routes.

<h3>Creating a Survey</h3>

To create a survey, will be needed to post the necessary data on http://localhost:3333/surveys. To do so, you must provide a json object on request's body, which must contain a title and a description. Both must contain at least 15 characters.

Example of a survey's object to be send on post's route:

```json
{
  "title": "Queremos ouvir sua opinião!",
  "description": "de 1 a 10, quanto você recomendaria a Rocketseat?"
}
```

<h3>Getting all created surveys</h3>

You can checkout all created surveys by access http://localhost:3333/surveys even in the browser. Will be return a list of all surveys created, it look's like:

```json
[
  {
    "id": "31335cae-0ec8-4bff-a6a9-18b086c340b7",
    "title": "Queremos ouvir sua opinião!",
    "description": "de 1 a 10, quanto você recomendaria a Rocketseat?",
    "created_at": "2021-03-02T13:37:19.000Z"
  }
]
```

<h3>Creating users</h3>

Similarly as creating surveys, to create a user will be needed to post a json object on http://localhost:3333/users. This object must contain a name and a valid email.

Example of a user's object to be send on post's route:

```json
{
  "name": "Example user",
  "email": "example@domain.com"
}
```

<h3>Sending a survey to a user</h3>

To sending a survey to users, its necessary post an json object on http://localhost:3333/sendMail route's and providing a valid email from a user already created and a survey's identification. See example below:

```json
{
  "email": "example@domain.com",
  "survey_id": "31335cae-0ec8-4bff-a6a9-18b086c340b7"
}
```

After this, a fake email will be sended with [Ethereal](https://ethereal.email/). A URL will be show on terminal, which we can access the fake e-mail. The following image show's a URL example, which we can copy and past on a browse.

![Ethereal URL's example](https://github.com/IagooCesaar/cursos-rocketseat-nlw-04-node/blob/main/.github/ethereal-url-example.jpg?raw=true)

By pasting the URL on a browser we can checkout the fake email. On his body, will displayed 10 buttons, numbered from 1 tom 10. Each one of then corresponds to a score, that be used to answer the survey.

![Ethereal fake email example](https://github.com/IagooCesaar/cursos-rocketseat-nlw-04-node/blob/main/.github/ethereal-email-example.jpg?raw=true)

Clicking on button with 10 value, we will be redirect to a new URL, which contains a route param `value` and a query param `survey_id`, used to identifying the user's answer. Both are required.

The following image is the result of clicking on the button.

![User's answer](https://github.com/IagooCesaar/cursos-rocketseat-nlw-04-node/blob/main/.github/answer.jpg?raw=true)

<h3>Calculating NPS</h3>

To get the final NPS will be needed to access the URL http://localhost:3333/nps/31335cae-0ec8-4bff-a6a9-18b086c340b7, which contains as route's param the survey identification.

The API will returns a json object, similar to:

```json
{
  "detractors": 0,
  "passives": 0,
  "promoters": 1,
  "totalAnswers": 1,
  "npsScore": 100
}
```

The `detractors`, `passives` and `promoters` properties represent how many users were ranked according to the response sent. The classification is carried out according to the table below:

<table>
  <thead>
    <tr>
      <th>Classification</th>
      <th>Range</th>
    </tr>
  </thead>
<tbody>
  <tr>
    <td>Detractors</td>
    <td>0 to 6</td>
  </tr>
  <tr>
    <td>Passivos</td>
    <td>7 to 8</td>
  </tr>
  <tr>
    <td>Promotores</td>
    <td>9 to 10</td>
  </tr>
</tbody>
</table>

So, the NPS calculations is proceeded as presents below:

```js
const totalAnswers = surveysUsers.length;

const detractors = surveysUsers.filter(
  (survey) => survey.value >= 0 && survey.value <= 6
).length;

const passives = surveysUsers.filter(
  (survey) => survey.value >= 7 && survey.value <= 8
).length;

const promoters = surveysUsers.filter(
  (survey) => survey.value >= 9 && survey.value <= 10
).length;

const npsScore = Number(
  ((100 * (promoters - detractors)) / totalAnswers).toFixed(2)
);
```

<h2>Thanks</h2>

I need to thank Rocketseat, the NLW organizers, especially [Daniele Leão Evangelista](https://twitter.com/danieleleao), who was the teacher of the NodeJS track, for the awesome free content.

# #NeverStopLearning!
