import styles from "./Context.module.css";

// Context: colleges and corporates against schools (1CONTEXT.svg), set in Geist with her hand-lettered
// note in Caveat. Side by side from 768 with her dashed arrow; stacked on phones.

const big = [
  ["Students", "Separate logins and browsing"],
  ["Librarian/Admin", "Runs daily workflows"],
  ["Purchasing Team", "Places and approves orders"],
];

export default function Context() {
  return (
    <figure className={styles.frame}>
      <div className={styles.panel}>
        <h3 className={styles.title}>Colleges &amp; Corporates</h3>
        <p className={styles.sub}>3 roles, 3 separate flows</p>
        <ul className={styles.list}>
          {big.map(([role, what]) => (
            <li key={role}>
              {role} - <strong>{what}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div className={`${styles.panel} ${styles.school}`}>
        <h3 className={`${styles.title} ${styles.schoolTitle}`}>Schools</h3>
        <p className={styles.sub}>One person runs everything</p>
        <ul className={styles.list}>
          <li className={styles.lit}>
            Librarian - <strong>Handles the whole workflow</strong>
          </li>
          <li className={styles.out}>
            Purchasing - <strong>Sits with the school ERP</strong>
          </li>
        </ul>
        <p className={styles.note}>One role handling everything</p>
      </div>

      {/* Her arrow, from "3 roles, 3 separate flows" over to the note. */}
      <svg className={styles.arrow} viewBox="0 0 1000 380" preserveAspectRatio="none" aria-hidden="true">
        <path d="M292 126 C 380 170, 470 140, 520 70 C 560 18, 680 18, 752 52" />
        <path d="M737 40 L 753 53 L 734 58" />
      </svg>
    </figure>
  );
}
