import styles from './HeroSection.module.css';
export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.dots} aria-hidden />
      <div className={`container ${styles.content}`}>
        <div className={`badge ${styles.badge}`}><span>✨</span><span>10,000+ Premium Prompts</span></div>
        <h1 className={styles.headline}>The World&apos;s Best<br /><span className="gradient-text">AI Prompt Library</span></h1>
        <p className={styles.subheadline}>Unlock stunning results from every AI platform. Curated prompts for Gemini, ChatGPT, Midjourney, DALL·E, Claude &amp; more — completely free.</p>
        <div className={styles.stats}>
          {[{value:'10K+',label:'Prompts'},{value:'8',label:'Platforms'},{value:'50K+',label:'Monthly Users'},{value:'100%',label:'Free'}].map(s => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
