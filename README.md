# HKU BOOKING (:construction: still under development)

## What is it
A script to easily and quickly book a seat in [Learning Commons @ HKU](http://www.les.hku.hk/teaching-learning/learning-space/booking-arrangement-of-learning-space). 

## Usage
**Caution:** this package requires you to have `node@>=8.x`

### 1. Create `credentials.js`
```js
const creds = {
    username: "thisismyusername",
    password: "thisismypassword"
}

module.exports = creds
```
`credentials.js` is included in `gitignore` by default.

### 2. Run `index.js`
```
$ git clone https://github.com/9oelM/hku-booking.git

$ cd hku-booking

$ npm install

$ node .\index.js
i Launching browser and page...
i Going onto HKU Login page...
Current URL: https://hkuportal.hku.hk/cas/servlet/edu.yale.its.tp.cas.servlet.Login?service=http://booking.its.hku.hk/lebook/book/Web/
i Username and password preconfigured in credentials.js found. Attempting to log in...
√ Login successful!
Current URL: http://booking.its.hku.hk/lebook/book/Web/schedule.php
? Tell me which date you want to use the room (Use arrow keys)
> 2018/11/17
  2018/11/18
  2018/11/19
```

## Stacks
* [Puppeteer](https://github.com/GoogleChrome/puppeteer)

## Todo
* Detect login error (`".loginerror"`)