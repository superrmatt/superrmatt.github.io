# Almanac

Daily Almanac Which Tracks Daily Information a User Might Find Helpful

@authors: Paul Kirscher, Carolene Wilson-Grizzle, Dameon Charley, & Matt Dambra

1. News
2. Calendar
3. Word of the day
4. Weather
5. Historical event "on this day"


1: The news is determined via API call to newsapi.org, prints up to 8 articles at one time, and allows the user to follow a link to the full article. Articles are chosen as first, there are no filters about what is being printed.

2: Calendar, shows the calendar for many years before and after current date. Next button allows user to jump to next month. Previous button allows user to jump to previous month.

3: Word of the day is chosen at first load after midnight and reaches out to a dictionary API. The word is chosen at random from a dictionary of roughly 80,000 words. The word, part of speech and up to three definitions.

4: Weather is chosen based on geolocation (upon user approval of location tracking), and can also be chosen via a search function. THe Geolocation is not totally accurate and can sometimes give the user weather from a few towns over. This is a problem with the creation of the coordinates, and not an issue in our code.

5: Historical event. Displays a random historical event that occured on this date. This is accomplished by querying an API that reaches out to wikpedia and scans for events that occured. This event is chosen at random on load. Therefore, user can read all possible events by simply refreshing, unlike word of the day.


Additional functionality possiblities:
    By use of Bulma tiles, we can add indefinite tiles to the webpage. This allows us to create more and more possible tiles. Some brainstormed ideas we had were:
    1. horoscope information: this would require user to enter in birthdate.
    2. holiday and event tracking: holidays could be obtained from a calendar api, evnets would require user input. For example: putting a work schedule, various appointments, etc.
    3. stock information: user could create a stock watchlist, or get a few "big names" such as Amazon, Apple, Microsoft, etc.
    4. Notepad, track notes with user input.
    5. Clock with timer, etc
    6. Calculator
    6. The possiblities really are endless.