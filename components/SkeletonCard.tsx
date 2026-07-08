import styles from './SkeletonCard.module.css';
export default function SkeletonCard() {
  return (
    <div className={`card ${styles.card}`} aria-hidden="true">
      <div className={`skeleton ${styles.image}`} />
      <div className={styles.body}>
        <div className={styles.meta}><div className={`skeleton ${styles.badge}`} /><div className={`skeleton ${styles.badge}`} /></div>
        <div className={`skeleton ${styles.title}`} />
        <div className={styles.lines}>
          <div className={`skeleton ${styles.line}`} style={{ width: '100%' }} />
          <div className={`skeleton ${styles.line}`} style={{ width: '90%' }} />
          <div className={`skeleton ${styles.line}`} style={{ width: '75%' }} />
        </div>
        <div className={styles.actions}>
          <div className={`skeleton ${styles.actionBtn}`} />
          <div className={`skeleton ${styles.actionBtn}`} />
          <div className={`skeleton ${styles.copyBtn}`} style={{ marginLeft: 'auto' }} />
        </div>
      </div>
    </div>
  );
}
