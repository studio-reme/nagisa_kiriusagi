// Loader dismissal
window.addEventListener('load', () => {
  const loader = document.getElementById('loader-wrapper');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('loaded');
    }, 500); // わずかな余韻を残して高級感を出す
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // JSが有効なことを示すクラスを追加（アクセシビリティ向上）
  document.body.classList.add('js-enabled');

  // Subtitle Glitch/Scramble Effect
  const glitchSubtitle = () => {
    const el = document.getElementById('glitch-subtitle');
    if (!el) return;

    const originalText = el.innerText;
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let iteration = 0;
    
    const interval = setInterval(() => {
        el.innerText = originalText.split('')
            .map((letter, index) => {
                if (index < iteration) {
                    return originalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        if (iteration >= originalText.length) {
            clearInterval(interval);
        }
        
        iteration += 1 / 2; // 復元のスピード（小さいほど遅い）
    }, 40);
  };

  // ページ読み込み完了から少し遅れて開始し、以降定期的に実行
  window.addEventListener('load', () => {
      setTimeout(() => {
          glitchSubtitle();
          setInterval(glitchSubtitle, 30000); // 30秒ごとに繰り返し実行
      }, 1200);
  });

  const header = document.querySelector("header");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  // Header Scroll Effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Mobile Menu Toggle
  const heroSns = document.querySelector(".hero-sns");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
      if (heroSns) heroSns.classList.toggle('active');
      
      // Prevent background scroll and shifts
      document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        if (heroSns) heroSns.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // Scroll Reveal Animation (Class-based for smoother transitions)
  const revealElements = document.querySelectorAll(
    ".portfolio-item, .section-header, .pricing-card, .guidelines-card, .hero-content, .hero-image-container"
  );

  revealElements.forEach((el, index) => {
    // 時間差（ディレイ）を短くしてテンポよく
    el.style.transitionDelay = `${index * 0.08}s`;
  });

  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.9; // 少し早めにトリガー

    revealElements.forEach((el) => {
      const elementTop = el.getBoundingClientRect().top;

      if (elementTop < triggerBottom) {
        el.classList.add("reveal-active");
      }
    });
  };



  // Mouse Stalker (Sparkling Stars) - 負荷軽減版
  let lastMouseX = 0;
  let lastMouseY = 0;
  let lastStarTime = 0;
  const STAR_INTERVAL = 50; // 星の生成間隔（ms）
  
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    // マウスの移動距離と時間で制御（負荷軽減）
    const dist = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
    
    if (dist > 15 && now - lastStarTime > STAR_INTERVAL) {
      createCursorStar(e.clientX, e.clientY);
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      lastStarTime = now;
    }
  });

  const createCursorStar = (x, y) => {
    const star = document.createElement('div');
    star.className = 'cursor-star';
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    
    // サイズをランダムに変化させる
    const size = Math.random() * 4 + 4;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    document.body.appendChild(star);

    // アニメーション終了後に削除
    setTimeout(() => {
      star.remove();
    }, 800);
  };

  // Gallery Slider Control (New Design)
  const sliders = document.querySelectorAll('.gallery-slider-wrapper');

  sliders.forEach(wrapper => {
    const slider = wrapper.querySelector('.gallery-slider');
    const prevBtn = wrapper.querySelector('.prev');
    const nextBtn = wrapper.querySelector('.next');
    
    // スクロール量の目安（アイテム幅 + gap）
    const scrollAmount = 300; 

    if (prevBtn && nextBtn && slider) {
      nextBtn.addEventListener('click', () => {
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });

      prevBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });

      // Mouse Drag Scroll Implementation for PC
      let isDown = false;
      let startX;
      let scrollLeft;

      slider.style.cursor = 'grab';

      slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active'); // activeクラスでscaleなどを制御したい場合に使用
        slider.style.cursor = 'grabbing';
        // ドラッグ中はスナップを無効化してスムーズに追従させる
        slider.style.scrollSnapType = 'none'; 
        slider.style.scrollBehavior = 'auto'; // ボタン操作のsmoothと干渉しないようにautoに

        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      });

      slider.addEventListener('mouseleave', () => {
        if (!isDown) return;
        isDown = false;
        slider.style.cursor = 'grab';
        slider.style.scrollSnapType = 'x mandatory'; // スナップ復帰
        slider.style.scrollBehavior = 'smooth';
      });

      slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
        slider.style.scrollSnapType = 'x mandatory'; // スナップ復帰
        slider.style.scrollBehavior = 'smooth';
      });

      slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault(); // 画像ドラッグなどを防止
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // スクロール速度調整（2倍速）
        slider.scrollLeft = scrollLeft - walk;
      });
    }
  });

  window.addEventListener("scroll", revealOnScroll);
  
  // ページ読み込み時の実行タイミングを最適化
  if (document.getElementById('loader-wrapper')) {
    // ホーム画面：ローダー消去の開始に合わせて実行
    window.addEventListener('load', () => {
      // 600ms後（ローダーが薄くなり始めた頃）にふわっと出す
      setTimeout(revealOnScroll, 600);
    });
  } else {
    // サブページ：CSSのページフェードインと合わせるため、遅延なしで即時計算
    // これにより、ページが表示された瞬間からコンテンツが存在する状態にする
    requestAnimationFrame(() => {
        revealOnScroll();
    });
    
    // 画像ロード完了時にも念のためレイアウト再計算
    window.addEventListener('load', revealOnScroll);
  }

  // Premium Star Background Generation
  const createStarField = () => {
    // 既存の星関連要素を削除（リセット用）
    const existingContainer = document.querySelector('.star-container');
    if (existingContainer) existingContainer.remove();

    // コンテナを作成
    const container = document.createElement('div');
    container.className = 'star-container';
    document.body.prepend(container);

    // 星の数を調整して上品に（多すぎると安っぽくなる）
    const starCount = window.innerWidth < 768 ? 60 : 120;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        
        // クラスのランダム割り当て（色違い）
        const colorType = Math.ceil(Math.random() * 3); // 1-3
        star.className = `premium-star star-color-${colorType}`;
        
        // ランダムな位置
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        
        // ランダムなサイズ（小さめにして繊細に）
        const size = Math.random() * 2 + 1; // 1px - 3px
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // ランダムなアニメーション設定（瞬き）
        const duration = Math.random() * 3 + 2; // 2s - 5s
        const delay = Math.random() * 5;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.animationDelay = `${delay}s`;
        
        // わずかなドリフト（移動）を追加して、静止画感をなくす
        // 線に見えないよう、非常にゆっくり、かつランダムな方向に
        // ここではCSSのdriftアニメーション（縦方向）を非常にゆっくり適用
        // star.style.animationName = 'twinkle, drift'; 
        // 複雑になるので、まずはTwinkleのみで「輝き」を強調する
        
        container.appendChild(star);
    }
  };

  createStarField();

  // Falling Star Rain Logic
  const createFallingStar = () => {
      const star = document.createElement('div');
      star.classList.add('falling-star');
      
      // X軸：画面全体＋右側（斜めに落ちてくるので右側外からもスタートさせる）
      // 角度によって左に流れる分を考慮し、右側の生成範囲を広げる
      const startX = Math.random() * window.innerWidth * 1.5 - (window.innerWidth * 0.2); 
      const startY = -60; // 画面上部外(尾の長さ分余裕を持つ)
      
      star.style.left = `${startX}px`;
      star.style.top = `${startY}px`;
      
      // 角度をランダムに (25度〜50度)
      const angle = Math.random() * 25 + 25;
      star.style.setProperty('--angle', `${angle}deg`);

      // サイズのばらつき（遠近感と強弱）
      // width固定(1px)で、長さ(height)をランダムに変えるともっと良い
      star.style.height = `${Math.random() * 30 + 20}px`; // 20px〜50px
      
      // 落下速度（雪より速く）
      const duration = Math.random() * 2 + 1.5; // 1.5s〜3.5s
      star.style.animation = `fall ${duration}s linear forwards`;
      
      document.body.appendChild(star);
      
      setTimeout(() => {
          star.remove();
      }, duration * 1000);
  };

  // 適度な頻度で生成して「小降りの星」にする
  const loopFallingStars = () => {
      // 200ms〜450ms間隔
      const delay = Math.random() * 250 + 200;
      setTimeout(() => {
          createFallingStar();
          loopFallingStars();
      }, delay);
  };
  
  // 開始
  setTimeout(loopFallingStars, 500);

  // Back to Top Button Logic
  const backToTopBtn = document.getElementById('back-to-top');
  
  if (backToTopBtn) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > 300) {
              backToTopBtn.classList.add('visible');
          } else {
              backToTopBtn.classList.remove('visible');
          }
      });

      backToTopBtn.addEventListener('click', () => {
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          });
      });
  }

});
