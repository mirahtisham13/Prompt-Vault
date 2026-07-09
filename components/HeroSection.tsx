import styles from './HeroSection.module.css';
export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.dots} aria-hidden />
      <div className={`container ${styles.content}`}>
        <h1 className={styles.headline}>The World&apos;s Best<br /><span className="gradient-text">AI Prompt Library</span></h1>
        <p className={styles.subheadline}>Unlock stunning results from every AI platform. Curated prompts for Gemini, ChatGPT, Midjourney, DALL·E, Claude &amp; more — completely free.</p>
      </div>
    </section>
  );
}
