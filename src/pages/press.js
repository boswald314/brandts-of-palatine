const { pageHeader, section, videoEmbed, img } = require("../templates/components");

module.exports = {
  slug: "press.html",
  title: "Press & Media",
  description:
    "Brandt's of Palatine in the news — ABC News, Chicago's Best Burgers, Off 53, and more.",
  render() {
    return (
      pageHeader(
        "Press & Media",
        "Brandt's has been featured on TV and in the local press."
      ) +
      // ABC News Review
      section(
        `
      <div class="press-item">
        <div class="press-media">${img(
          "Screen-Shot-2013-09-15-at-7.34.09-PM.png",
          "ABC News review of Brandt's of Palatine"
        )}</div>
        <div class="press-body">
          <h2>ABC News Review</h2>
          <p>Steve Dolinsky — ABC's "The Hungry Hound" — stopped by to review Brandt's.
            Watch his take on our burgers and tavern fare.</p>
          <p><a class="btn btn-ghost" target="_blank" rel="noopener"
            href="http://abclocal.go.com/wls/story?section=resources/lifestyle_community/food/restaurants&id=9247451">
            Watch the Hungry Hound review →</a></p>
        </div>
      </div>`,
        { id: "abc", cls: "press-section" }
      ) +
      // Chicago's Best Burgers
      section(
        `
      <div class="press-item reverse">
        <div class="press-media">${videoEmbed(
          "https://www.youtube-nocookie.com/embed/GQQedC8jkc0",
          "Brandt's of Palatine on Chicago's Best"
        )}</div>
        <div class="press-body">
          <h2>Chicago's Best Burgers</h2>
          <p>Brandt's was featured on <em>Chicago's Best</em> for our burgers.
            Check out the segment.</p>
        </div>
      </div>`,
        { id: "burgers", cls: "press-section alt" }
      ) +
      // Off 53 Video
      section(
        `
      <div class="press-item">
        <div class="press-media">${videoEmbed(
          "https://player.vimeo.com/video/433731406?h=84d47aacc6",
          "Off 53 featuring Brandt's of Palatine"
        )}</div>
        <div class="press-body">
          <h2>Off 53 Video Featuring Brandt's</h2>
          <p>A local feature spotlighting Brandt's, our history, and our place in the
            Palatine community.</p>
        </div>
      </div>`,
        { id: "off53", cls: "press-section" }
      ) +
      // In the News (article links — attribution + link, not reproduced)
      section(
        `
      <h2 class="center">In the News</h2>
      <ul class="press-links">
        <li>
          <a target="_blank" rel="noopener"
            href="http://www.dailyherald.com/article/20130410/news/704109713/">
            Daily Herald — "Menu, renovations give Palatine's Brandt's a new lease on life"</a>
          <span class="press-byline">by Deborah Pankey, Daily Herald</span>
        </li>
        <li>
          <a target="_blank" rel="noopener"
            href="http://palatine.patch.com/articles/brandt-s-of-palatine-is-open-for-business">
            Palatine Patch — "Brandt's of Palatine is open for business"</a>
        </li>
        <li>
          <a target="_blank" rel="noopener"
            href="https://patch.com/illinois/palatine/the-back-story-to-brandt-s-of-palatine">
            Palatine Patch — "The back story to Brandt's of Palatine"</a>
        </li>
      </ul>`,
        { id: "articles", cls: "press-section alt" }
      )
    );
  },
};
