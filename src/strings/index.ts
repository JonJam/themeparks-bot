export default {
  greetings: {
    goodbye: {
      message: "Bye."
    },
    hello: {
      welcomeBack: "Welcome back!",
      welcomeNew: "Hi I am Theme Park Bot."
    },
    none: {
      messages: [
        "Ah ah ah, you didn't say the magic word.",
        "I'm sorry, Dave. I'm afraid I can't do that.",
        "Computer says no."
      ]
    }
  },
  operatingHours: {
    park: {
      additionalHoursMessage: " There are also additional events:\n\n",
      closed: "closed",
      endsAt: "* Ends at: %s\n",
      noData: "Sorry I was unable to find out the operating hours.",
      open: "open",
      operatingHoursMessage: "%s is %s. It opens at %s and closes at %s on %s.",
      startsAt: "* Starts at: %s\n"
    }
  },
  parks: {
    parkIntro: {
      message1: "You selected: ",
      message2: "Try asking questions about rides and operating hours."
    },
    stillInterestedInPark: {
      prompt: "Are you still interested in %s?"
    },
    whichPark: {
      prompt: "Which park are you interested in?",
      retryPrompt:
        "Sorry I didn’t understand. Please choose an option from the list by either entering the number or park name."
    }
  },
  rides: {
    all: {
      message: "The rides are:\n\n"
    },
    commom: {
      noData: "Sorry I was unable to get ride information at this time."
    },
    fastPass: {
      message: "The rides with fast pass are:\n\n",
      notSupported: "%s does not have fast pass."
    },
    whichRide: {
      prompt: "Sorry I didn't understand. Which ride are you interested in?",
      retryPrompt:
        "Sorry I didn’t understand. Please choose an option from the list by either entering the number or ride name."
    }
  },
  waitTimes: {
    all: {
      message: "The current wait times are:\n\n"
    },
    common: {
      allRidesClosed: "Currently all rides are closed.",
      closed: "Closed",
      noData: "Sorry I was unable to find out the wait times.",
      time: "%s minutes",
      waitTime: "%s - %s\n\n"
    },
    longest: {
      message: "The longest wait time is: %s"
    },
    shortest: {
      message: "The shortest wait time is: %s"
    }
  }
};
