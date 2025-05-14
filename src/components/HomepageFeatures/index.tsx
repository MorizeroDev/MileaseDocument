import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '易于编写',
    Svg: require('@site/static/img/write.svg').default,
    description: (
      <>
        Milease 基于表达式树、成员扩展和运算符重载，构建了一套流式动画 DSL，语法简洁，上手轻松。
      </>
    ),
  },
  {
    title: '低开销',
    Svg: require('@site/static/img/performance.svg').default,
    description: (
      <>
        Milease 支持通过 JIT 编译或源代码生成的方式，避免频繁的运行时反射，实现对任意字段或属性的高效、平滑控制；
        它的运行时开销极低，具备良好的复用性，性能可与 DoTween 媲美。
      </>
    ),
  },
  {
    title: '高度灵活',
    Svg: require('@site/static/img/flexible.svg').default,
    description: (
      <>
        Milease 内置 30 多种缓动函数，支持在动画节点中灵活插入委托，实现更丰富的行为控制。
      </>
    ),
  },
  {
    title: '高效 UI 开发',
    Svg: require('@site/static/img/rocket.svg').default,
    description: (
      <>
        提供 MilListView 虚拟列表与基础 UI 组件，覆盖高频场景，UI 开发无需重复造轮子。
      </>
    ),
  },
  {
    title: '轻量化设计',
    Svg: require('@site/static/img/leaf.svg').default,
    description: (
      <>
        开发者可以随时使用 Milease 快速构建、嵌套动画逻辑，无需操心生命周期与资源清理，专注创意即可。
      </>
    ),
  },
  {
    title: '经过广泛验证',
    Svg: require('@site/static/img/earth.svg').default,
    description: (
      <>
        Milease 已在《Milthm》和《Notanote》等上线游戏中落地应用，运行于上万台真实设备。
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
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
