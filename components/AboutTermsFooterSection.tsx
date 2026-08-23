'use client';

import React, { useState } from 'react';
import styles from './AboutTermsFooterSection.module.css';

export function AboutTermsFooterSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className={styles.sectionWrapper} aria-label="Department Info and Terms & Conditions">
      <div className={styles.container}>
        
        {/* Informational SEO Text Block */}
        <div className={styles.seoTextBlock}>
          
          <h2 className={styles.contentHeading}>
            About Saudi Fab Store
          </h2>

          <p className={styles.paragraph}>
            Saudi Fab Store is Saudi Arabia&apos;s premier industrial B2B digital procurement platform and structural steel fabrication hub, operating state-of-the-art manufacturing facilities in Dammam Industrial City. We specialize in SASO-certified steel fabrications, forklift attachments, site logistics skips, safety enclosures, and industrial hardware tailored for contractors, engineers, and mega-projects across the Kingdom of Saudi Arabia (KSA) and the GCC.
          </p>

          <p className={styles.introParagraph}>
            Fulfilling project timelines matters whether you are replacing a hydraulic torque wrench before an emergency shift or procuring heavy structural beams for major site expansions. You can match fulfillment methods to your project schedule instead of forcing every item into one timeline.
          </p>

          <h2 className={styles.contentHeading}>
            Navigating industrial categories on Saudi Fab Store
          </h2>

          <p className={styles.paragraph}>
            During Saudi Fab Store procurement, you can narrow your search by industrial category to keep project specifications focused and compliant. You can compare structural steel plates in Heavy Fabrications, CNC laser cut components in Precision Engineering, waste skip containers in Site Logistics, and certified safety gear in Industrial Equipment.
          </p>

          <p className={styles.paragraph}>
            This structured category hierarchy streamlines procurement when your purchase order serves multiple engineering teams, site managers, or sub-contractors simultaneously. You can move from welding consumables to heavy steel beams and skip dumpsters within a single, seamless digital workflow.
          </p>

          {isExpanded && (
            <>
              <p className={styles.paragraph}>
                If you are managing site expansion, you can combine structural H-beams, reinforced storage skips, and hydraulic torquing units in one checkout. If you are servicing workshop machinery, you can source power tools, safety helmets, and hardware fasteners with minimal administrative overhead.
              </p>
              <p className={styles.paragraph}>
                For large-scale infrastructure projects across Riyadh, Dammam, and Jeddah, you can evaluate custom fabrication quotes, bulk raw steel, and site consumables together. You can also verify whether items are available for express local dispatch or scheduled heavy flatbed transport.
              </p>

              <h2 className={styles.contentHeading}>
                Understanding everyday industrial pricing and Saudi Fab contract rates
              </h2>

              <p className={styles.paragraph}>
                When evaluating corporate procurement budgets, you should understand how pricing tiers assist your planning. You will find standard commercial rates as consistent everyday pricing, while Saudi Fab contract rollbacks highlight volume-based project discounts.
              </p>
              <p className={styles.paragraph}>
                That distinction enables project managers to determine whether to stock up on recurring consumables or take advantage of limited-time material allocations. You can rely on steady pricing for structural staples and highlighted offers for project-based cost savings.
              </p>
              <p className={styles.paragraph}>
                If your operations regularly require MIG/TIG welding wire, grinding discs, or site safety gear, you can maintain pricing consistency across recurring purchase orders. If you are outfitting a new fabrication facility, you can leverage volume rollbacks on heavy machinery.
              </p>
              <p className={styles.paragraph}>
                You can also verify item availability across our regional distribution hubs before finalizing fulfillment. You can then choose whether immediate warehouse pickup or dedicated freight delivery best aligns with your project deadline.
              </p>

              <h2 className={styles.contentHeading}>
                Key considerations before confirming your industrial order
              </h2>

              <p className={styles.paragraph}>
                Before completing your transaction, you should verify SASO material certifications, technical load capacities, and custom CAD/DXF drawing specifications where applicable. Measuring structural dimensions and reviewing hydraulic compatibility before ordering ensures seamless site integration.
              </p>
              <p className={styles.paragraph}>
                These preliminary checks prevent project downtime by ensuring steel plate thicknesses and flange dimensions exactly match structural engineering blueprints. Matching ISO standards and delivery schedules upfront keeps your job site running smoothly.
              </p>
              <p className={styles.paragraph}>
                If your order combines heavy structural fabrications with lightweight workshop supplies, you should review the dispatch method for each item category. You can assign urgent tools to express courier dispatch while scheduling heavy steel for flatbed transport.
              </p>
              <p className={styles.paragraph}>
                With digital procurement on SaudiFabStore.com, you can organize recurring inventory, custom steel orders, and emergency site replacements according to actual operational demands. You leave with an order tailored to your schedule, your engineering requirements, and your preferred delivery method.
              </p>
            </>
          )}

          <button 
            type="button" 
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.toggleBtn}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>

        </div>

        {/* Terms & Conditions Section */}
        <div className={styles.termsSection}>
          <h2 className={styles.termsHeading}>Terms &amp; Conditions</h2>
          <p className={styles.termsDisclaimer}>
            *Express delivery timelines vary based on item dimensions, site access, traffic, and municipal permits. All structural steel is subject to SASO standards and ISO 9001 quality compliance. Additional commercial terms apply.
          </p>
        </div>

      </div>
    </section>
  );
}
