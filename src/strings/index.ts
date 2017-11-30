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
  parks: {
    operatingHours: {
      additionalHoursMessage: " There are also additional events:\n\n",
      closed: "It is currently closed.",
      endsAt: "* Ends at: %s\n",
      noData: "Sorry I was unable to find out the operating hours.",
      operatingHoursMessage: "%s opens at %s and closes at %s on %s.",
      startsAt: "* Starts at: %s\n"
    },
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
  }
};
