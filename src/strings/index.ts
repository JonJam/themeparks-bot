export default {
  default: {
    message:
      "%s \n\n Sorry, I did not understand. Type 'help' if you need assistance.",
    randomMessage: [
      "Ah ah ah, you didn't say the magic word.",
      "I'm sorry, Dave. I'm afraid I can't do that.",
      "Computer says no."
    ]
  },
  fastPass: {
    all: {
      message: "The rides with fast pass are:\n\n",
      notSupported: "%s does not have fast pass."
    },
    common: {
      noData: "Sorry I was unable to get ride information at this time."
    },
    ride: {
      noMessage: "No. %s doesn't have fast pass.",
      yesMessage: "Yes. %s has fast pass."
    }
  },
  global: {
    help: {
      message:
        "You can ask me things about:\n\nWait times\n\n * What are the wait times?\n\n * What is the wait time for The Incredible Hulk?\n\n * What ride has the longest/shortest wait?\n\n Rides\n\n * What rides are there?\n\n * What rides are open/closed?\n\n * Is Space Mountain open/closed?\n\n * What rides have fastpass?\n\n * Does Revenge of the Mummy have fastpass?\n\n Park\n\n * When does it open/close?\n\n * Select park\n\n * Change park"
    },
    switchPark: {
      message: "You selected: %s"
    }
  },
  greetings: {
    firstRun: {
      message:
        "Hi! I'm Theme Park Bot. Try asking me things like 'select park', 'what are the wait times?' or 'help' for more assistance."
    },
    hello: {
      message: "Welcome back!",
      selected: "You selected: %s"
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
    common: {
      noData: "Sorry I was unable to get ride information at this time."
    },
    whichRide: {
      prompt: "Sorry I didn't understand. Which ride are you interested in?",
      retryPrompt:
        "Sorry I didn’t understand. Please choose an option from the list by either entering the number or ride name."
    }
  },
  status: {
    all: {
      closedMessage: "The closed rides are:\n\n",
      openMessage: "The open rides are:\n\n"
    },
    common: {
      noData: "Sorry I was unable to get ride information at this time."
    },
    ride: {
      closed: "closed",
      message: "%s. %s is %s.",
      no: "No",
      open: "open",
      yes: "Yes"
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
