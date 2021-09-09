/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to use',
    description: (
      <>
        Includes utilities to simplify common use cases like multiple,, dynamic
        or automatic loading states, reducing the boilerplate code.
      </>
    ),
  },
  {
    title: 'Reactive',
    description: (
      <>
        Uses RxJS behind the hood to performs state updating, side effects and
        more. Supports Angular OnPush change detection strategy.
      </>
    ),
  },
  {
    title: 'Angular DI',
    description: (
      <>
        Uses angular dependency injection to access state across components
        easily, allowing you to do more work with less code.
      </>
    ),
  },
];

function Feature({ title, image, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
