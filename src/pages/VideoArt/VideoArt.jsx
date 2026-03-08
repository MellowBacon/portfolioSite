import PageTransition from '../../components/PageTransition/PageTransition'
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal'

const VIDEOS = [
  {
    id: '1066783296',
    title: 'Ebb and Flow',
    params: 'badge=0&autopause=0&player_id=0&app_id=58479',
    reverse: true,
    caption: (
      <>
        <em>Ebb and Flow</em> is a video art piece thinking about our changing planet.
        <br /><br />
        A collaboration with{' '}
        <a
          href="https://averyjam.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', fontWeight: 'bold' }}
        >
          Avery Jam
        </a>.
      </>
    ),
  },
  {
    id: '1064859715',
    title: 'Household Experiments',
    reverse: false,
    caption: (
      <>
        <em>Household Experiments</em> is a macro video that shows a different view of
        simple chemical reactions that can be done with household products.
        <br /><br />
        It abstracts the everyday into something otherworldly.
      </>
    ),
  },
  {
    id: '1064853626',
    title: 'Culture Shock',
    reverse: true,
    caption: (
      <>
        <em>Culture Shock</em> is a video collage project that attempts to immerse the
        viewer in cultures that have seemed so far away to me.
        <br /><br />
        All the videos are found footage from Google Maps, mostly posted in the review
        section of businesses. In a way, this is a condensed visit to these locations.
      </>
    ),
  },
  {
    id: '1064867250',
    title: 'AI Self Portrait',
    reverse: false,
    caption: (
      <>
        <em>AI Self Portrait</em> is an experiment exploring the advancement of AI tech
        in 2024. The prompt was to use Processing 4 (a coding sketchbook for visual
        artists) to create digital visualizations and then explain the visuals.
        <br /><br />
        I then fed its explanations into a voice synthesizer, which I modified because,
        by this point, I was pretty spooked.
        <br /><br />
        I found it to be an interesting experience that highlighted some strengths and
        weaknesses of the technology at the time.
      </>
    ),
  },
  {
    id: '1065173650',
    title: 'Rotoscope',
    reverse: true,
    caption: (
      <>
        This is a rotoscope-style animation made with footage I shot before the war in
        Ukraine started, as well as video pulled from a Telegram channel after videos of
        the war began to come out.
        <br /><br />
        I was pretty shocked when I started to see footage come out of Ukraine using some
        of the same tech I was using to do science experiments for my astronomy class.
        The shots I had were insanely similar.
        <br /><br />
        Except instead of dropping hacky sacks, it was grenades.
        <br />
        <em>Music Credit: Taras Keen Zомбі</em>
      </>
    ),
  },
]

export default function VideoArt() {
  return (
    <PageTransition>
      <div style={{ paddingTop: '80px', background: '#fff' }}>
        <section className="photo-wall">
          <h2>Video Art</h2>
          {VIDEOS.map((v, i) => (
            <ScrollReveal key={v.id} delay={0.05 * i}>
              <div className={`video-section${v.reverse ? ' reverse' : ''}`}>
                <div className="video-container">
                  <iframe
                    src={`https://player.vimeo.com/video/${v.id}?title=0&byline=0&portrait=0${v.params ? '&' + v.params : ''}`}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                    title={v.title}
                  />
                </div>
                <p className="video-caption">{v.caption}</p>
              </div>
            </ScrollReveal>
          ))}
        </section>
      </div>
    </PageTransition>
  )
}
