import React from 'react';
const Home = ({ onLaunchApp }) => {
    return (
        <div className="page-wrapper">
            <div className="bg-navbar-wrapper">
                <div className="bg-navbar"></div>
            </div>
            <div className="main-navbar">
                <div data-animation="default" data-collapse="none" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="navbar w-nav">
                    <div className="navbar-container">
                        <div className="nuv-start">
                            <a href="index.html" aria-current="page" className="logo-wrapper w-inline-block w--current">
                                <div className="logo-svg w-embed">
                                    <img src="/name.png" alt="Liquid Nation Logo" style={{ height: '45px', width: 'auto' }} />
                                </div>
                            </a>
                        </div>
                        <div className="navbar-menu_wrapper">
                            <nav role="navigation" className="nav-menu w-nav-menu">
                                <div className="nav-menu">
                                    <a href="#about" className="nav-link">Home</a>
                                    <button onClick={() => onLaunchApp('dashboard')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Dashboard</button>
                                    <button onClick={() => onLaunchApp('offers')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Offers</button>
                                    <button onClick={() => onLaunchApp('create')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Create</button>
                                    <button onClick={() => onLaunchApp('swap')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Swap</button>
                                    <button onClick={() => onLaunchApp('settings')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Settings</button>
                                </div>
                            </nav>
                        </div>
                        <div className="nuv-end">
                            <button onClick={onLaunchApp} className="button-blur w-button">Launch App</button>
                            <div className="menu-btn w-nav-button">
                                <div className="burger">
                                    <div className="burger-1">
                                        <div className="b2-bar1"></div>
                                        <div className="b2-middle-wrap">
                                            <div className="b2-middle-bar-left"></div>
                                            <div className="b2-middle-bar-right"></div>
                                        </div>
                                        <div className="b2-bar3"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <main className="main-wrapper">
                <section className="section">
                    <div className="overflow-hidden">
                        <div className="padding-global">
                            <div className="container-large">
                                <div className="hero-block">
                                    <div className="w-layout-hflex h1-and-cta">
                                        <div className="h1-wrapper">
                                            <div className="tagblock"><img src="images/tag.png" loading="lazy" alt="" className="icon-1x1-24 front-near-img" />
                                                <div>Powered by Charms Protocol</div>
                                            </div>
                                            <h1 className="text-color-white">Trade Across Chains with</h1>
                                            <h2 className="text-color-white-60" style={{ marginTop: '-20px' }}><img src="/name.png" alt="Liquid Nation Logo" style={{ height: '110px', width: 'auto' }} /></h2>
                                        </div>
                                        <button onClick={onLaunchApp} className="button w-inline-block">
                                            <div>Launch App</div>
                                        </button>
                                    </div>
                                    <div className="hero-middle-spacer"></div>
                                    <div className="hero-dashboard">
                                        <div className="back-drop-bg"></div><img src="images/Dashboard-n.png" loading="lazy" alt="" className="main-dashboard" /><img src="images/Coin_1.avif" loading="eager" alt="" className="hero-abs-coins" />
                                        <div className="mini-dashbord-left"><img src="images/CardBodyBlurEffects.png" loading="lazy" alt="" className="is-image-dash" /></div>
                                        <div className="mini-dashbord-right"><img src="images/CardBody1BlurEffects.png" loading="lazy" alt="" className="is-image-dash" /></div><img src="images/Gradient.avif" loading="eager" alt="" className="dashboard-liner-bg" />
                                    </div><img src="images/Coin2_1.avif" loading="eager" alt="" className="hero-abs-coins-2" />
                                </div>
                            </div>
                        </div>
                        <div className="liner-bg-hero"></div>
                    </div>
                </section>
                <section className="section">
                    <div className="overflow-hidden">
                        <div className="padding-global">
                            <div className="container-large">
                                <div className="prime-line-divider"></div>
                                <div className="features-grid">
                                    <div id="w-node-_8d2ee3ab-d89f-c5d4-7365-fc0d4167cbd0-d144478d" className="feauture-col">
                                        <div className="text-prime-liner">
                                            <div className="subtitle-18">$2.5B+</div>
                                        </div>
                                        <div className="text-main-14">Trading Volume</div>
                                    </div>
                                    <div id="w-node-bc325806-39d4-5216-7931-91435a09f0af-d144478d" className="feauture-col">
                                        <div className="text-prime-liner">
                                            <div className="subtitle-18">50k+</div>
                                        </div>
                                        <div className="text-main-14">Active Traders</div>
                                    </div>
                                    <div id="w-node-_0e7f1bc3-a785-553e-369b-61f6f7548b1c-d144478d" className="feauture-col">
                                        <div className="text-prime-liner">
                                            <div className="subtitle-18">$125k+</div>
                                        </div>
                                        <div className="text-main-14">Trades Completed</div>
                                    </div>
                                    <div id="w-node-_07bc3ac8-40a3-0b97-7d9f-1ff7b49aeaf9-d144478d" className="feauture-col">
                                        <div className="text-prime-liner">
                                            <div className="subtitle-18">Zk Proofs</div>
                                        </div>
                                        <div className="text-main-14">Cryptographic Verification not trust</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="about" className="section">
                    <div className="overflow-hidden">
                        <div className="padding-global">
                            <div className="container-large">
                                <div className="spacer-xhuge"></div>
                                <div className="block-wrapper">
                                    <div className="h2-center">
                                        <div className="clip is-720">
                                            <div className="text-color-white">
                                                <h2>Built for private, direct swaps<br />It doesn&apos;t get more trustless.</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bento-grid-2x">
                                        <div id="w-node-aaa51f30-fd93-17b1-7288-b5fa88750a4d-d144478d" className="anime-stroke-card-wrapper">
                                            <div id="w-node-e83db804-4762-568c-23ff-1e081405a534-d144478d" className="bento-card-big">
                                                <div className="h3-wrapper">
                                                    <div className="text-color-white">
                                                        <h3>Instant Swaps</h3>
                                                    </div>
                                                    <div>Execute cross-chain trades in seconds with our streamlined exchange protocol</div>
                                                </div><img src="images/Digital-flow-2.png" loading="lazy" alt="" className="bento-big-image" />
                                            </div>
                                            <div className="stroke-rectangle is-white is-12"></div>
                                            <div className="stroke-rectangle is-gradient"></div>
                                        </div>
                                        <div id="w-node-cbac72d1-404d-2d63-43da-dfb1dc34c23d-d144478d" className="anime-stroke-card-wrapper">
                                            <div id="w-node-_7455b417-054b-896d-8538-84120088aab8-d144478d" className="bento-card-big is-p2p">
                                                <div className="h3-wrapper">
                                                    <div className="text-color-white">
                                                        <h3>Fair Market Prices</h3>
                                                    </div>
                                                    <div>Competitive rates driven by real-time market dynamics</div>
                                                </div><img src="images/Right-Section_1.avif" loading="lazy" alt="" className="bento-big-image" />
                                                <div className="p2p-bottom-text"><img src="images/frame-22.svg" loading="lazy" alt="" className="icon-1x1-16" />
                                                    <div className="text-main-14">Real-time global market rates</div>
                                                </div>
                                            </div>
                                            <div className="stroke-rectangle is-white is-12"></div>
                                            <div className="stroke-rectangle is-gradient"></div>
                                        </div>
                                        <div id="w-node-a7055dd4-ef56-98bd-0f7c-9e200db2daae-d144478d" className="anime-stroke-card-wrapper">
                                            <div id="w-node-d52d8fab-1079-92f5-b460-e2fd2ad776f5-d144478d" className="bento-card-big is-p2p">
                                                <div className="h3-wrapper">
                                                    <div className="text-color-white">
                                                        <h3>Multi-Chain Support</h3>
                                                    </div>
                                                    <div>Trade assets seamlessly across multiple blockchain networks</div>
                                                </div>
                                                <div className="p2p-wrapper"><img src="images/Frame-1000002945.png" loading="lazy" alt="" className="p2p-iamge" />
                                                    <div className="p2p-elipse"></div>
                                                    <div className="p2p-elipse is-2"></div>
                                                </div>
                                                <div className="p2p-bottom-text"><img src="images/Frame.svg" loading="lazy" alt="" className="icon-1x1-16" />
                                                    <div className="text-main-14">Fully encrypted exchange</div>
                                                </div>
                                            </div>
                                            <div className="stroke-rectangle is-white is-12"></div>
                                            <div className="stroke-rectangle is-gradient"></div>
                                        </div>
                                        <div id="w-node-_9a299df2-add4-bb80-a88f-6986b7339aa4-d144478d" className="anime-stroke-card-wrapper">
                                            <div id="w-node-_4b1c4cb3-6002-a5dc-214a-84f54548773e-d144478d" className="bento-card-big">
                                                <div className="h3-wrapper">
                                                    <div className="text-color-white ">
                                                        <h3 className="clip is-mobile-20">Powered by Charms Protocol.</h3>
                                                    </div>
                                                    <div>Secure Connection. Private Blockchain.</div>
                                                </div><img src="images/charms-logo.png" loading="lazy" alt="Charms Protocol" className="bento-big-image" style={{ objectFit: 'contain' }} />
                                                <div className="moner-tor_wrapper"><img src="images/Icon-Container.png" loading="lazy" alt="" className="tor-monero-image" /></div>
                                            </div>
                                            <div className="stroke-rectangle is-white is-12"></div>
                                            <div className="stroke-rectangle is-gradient"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="overflow-clip">
                    <section className="section">

                        <div className="container-large is-more">
                            <div className="spacer-huge"></div>
                            <div className="block-wrapper">
                                <div className="swaps-component">
                                    <div className="text-color-white">
                                        <div className="swaps-content">
                                            <h2 className="h1-80">10,000+ Swaps</h2>
                                            <div>completed on the decentralized Liquid Nation network.</div>
                                        </div>
                                    </div>
                                    <div className="swaps-media_wrapper"><video style={{ width: '100%' }} preload="auto" playsInline autoPlay loop muted><source src="/video/coin_animation.mov" type="video/mp4" /></video></div>
                                </div>
                            </div>
                        </div>

                    </section>
                    <section id="start" className="section">
                        <div className="padding-global">
                            <div className="container-large">
                                <div className="spacer-huge"></div>
                                <div className="block-wrapper">
                                    <div className="steps-component">
                                        <div className="steps-track">
                                            <div className="sticky-part-steps">
                                                <div className="h2-and-button">
                                                    <h2 className="text-color-white">Simple steps to trade across chains</h2>
                                                    <button onClick={onLaunchApp} className="button w-inline-block">
                                                        <div>Launch App</div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="all-steps-wrapper">
                                            <div className="anime-stroke-card-wrapper">
                                                <div className="one-step-card">
                                                    <div className="step-card-content">
                                                        <div className="step-name">
                                                            <h3 className="text-color-white">Connect Wallet</h3>
                                                            <div>Connect your Web3 wallet to get started</div>
                                                        </div>
                                                        <div className="step-number-circle">
                                                            <div>01</div>
                                                        </div>
                                                    </div><img src="images/Digital-flow-3.png" loading="lazy" alt="" className="step-image" />
                                                </div>
                                                <div className="stroke-rectangle is-white is-20"></div>
                                                <div className="stroke-rectangle is-gradient is-60"></div>
                                            </div>
                                            <div className="anime-stroke-card-wrapper">
                                                <div className="one-step-card">
                                                    <div className="step-card-content">
                                                        <div className="step-name">
                                                            <h3 className="text-color-white">Create/Browse Orders</h3>
                                                            <div>Create a trade order or browse existing peer offers</div>
                                                        </div>
                                                        <div className="step-number-circle">
                                                            <div>02</div>
                                                        </div>
                                                    </div><img src="images/Digital-flow-1.png" loading="lazy" alt="" className="step-image step-2 is-2" />
                                                </div>
                                                <div className="stroke-rectangle is-white is-20"></div>
                                                <div className="stroke-rectangle is-gradient is-60"></div>
                                            </div>
                                            <div className="anime-stroke-card-wrapper">
                                                <div className="one-step-card">
                                                    <div className="step-card-content">
                                                        <div className="step-name">
                                                            <h3 className="text-color-white">Execute Swap & Receive Assets</h3>
                                                            <div>Execute the swap and receive your assets</div>
                                                        </div>
                                                        <div className="step-number-circle">
                                                            <div>03</div>
                                                        </div>
                                                    </div><img src="images/Hands.png" loading="lazy" alt="" className="step-image is-3" />
                                                </div>
                                                <div className="stroke-rectangle is-white is-20"></div>
                                                <div className="stroke-rectangle is-gradient is-60"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="spacer-xhuge"></div>
                            </div>
                        </div>
                    </section>
                </div>
                <section id="feedback" className="section is-bg-dark">
                    <div className="overflow-hidden">
                        <img src="images/Image-9.avif" loading="eager" alt="" className="image-blur-bg" />
                        <div className="padding-global is-0">
                            <div className="container-large">
                                <div className="block-wrapper">
                                    <div className="testimonials-component">
                                        <div className="testimonial-left">
                                            <div className="clip is-380">
                                                <h2 className="text-color-white">What the community says about us</h2>
                                            </div>
                                        </div>
                                        <div className="grid-testimonials">
                                            <div className="bottom-bar-liner"></div>
                                            <div className="top-bar-liner"></div>
                                            <div className="row-testimonials">
                                                <div className="colum-testimonial">
                                                    <div className="item-testimonial is-hide">
                                                        <div className="text-main-14">This platform is everything a crypto user needs. The interface is clean, the process is smooth, and the privacy features are outstanding. The fact that I can trade without worrying about hidden fees is a game-changer. I’ll definitely continue using it!</div>
                                                        <div className="item-testimonial_bottom">
                                                            <div className="testimonial-author"><img src="images/Frame-1000002946.png" loading="lazy" alt="" className="author-image" />
                                                                <div className="author-name">
                                                                    <div className="author-name-text">Michael Carter</div>
                                                                    <div className="text-main-14">Crypto entusiast</div>
                                                                </div>
                                                            </div>
                                                            <div className="source-circle"><img src="images/X-logo.svg" loading="lazy" alt="" className="icon-1x1-16" /></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="colum-testimonial">
                                                    <div className="item-testimonial">
                                                        <div className="text-main-14">In a situation where the EU has declared war on anonymous cryptocurrencies and all centralized exchanges have delisted Monero from EU countries, haveno-reto is an absolutely crucial tool to continue to trade Monero in a safe and trustworthy way.</div>
                                                        <div className="item-testimonial_bottom">
                                                            <div className="testimonial-author"><img src="images/Profile-Image.png" loading="lazy" alt="" className="author-image" />
                                                                <div className="author-name">
                                                                    <div className="author-name-text">Pavol Lupták</div>
                                                                    <div className="text-main-14">Cryptoanarchist</div>
                                                                </div>
                                                            </div>
                                                            <a href="https://x.com/wilderko" target="_blank" className="source-circle"><img src="images/X-logo.svg" loading="lazy" alt="" className="icon-1x1-16" /></a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="colum-testimonial">
                                                    <div className="item-testimonial is-hide">
                                                        <div className="text-main-14">This platform is everything a crypto user needs. The interface is clean, the process is smooth, and the privacy features are outstanding. The fact that I can trade without worrying about hidden fees is a game-changer. I’ll definitely continue using it!</div>
                                                        <div className="item-testimonial_bottom">
                                                            <div className="testimonial-author"><img src="images/Frame-1000002947.png" loading="lazy" alt="" className="author-image" />
                                                                <div className="author-name">
                                                                    <div className="author-name-text">James Walker</div>
                                                                    <div className="text-main-14">Somone</div>
                                                                </div>
                                                            </div>
                                                            <div className="source-circle"><img src="images/X-logo.svg" loading="lazy" alt="" className="icon-1x1-16" /></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row-testimonials">
                                                <div className="colum-testimonial">
                                                    <div className="item-testimonial is-hide">
                                                        <div className="text-main-14">This platform is everything a crypto user needs. The interface is clean, the process is smooth, and the privacy</div>
                                                        <div className="item-testimonial_bottom">
                                                            <div className="testimonial-author"><img src="images/Frame-1000002949.png" loading="lazy" alt="" className="author-image" />
                                                                <div className="author-name">
                                                                    <div className="author-name-text">William Roberts</div>
                                                                    <div className="text-main-14">Somone</div>
                                                                </div>
                                                            </div>
                                                            <div className="source-circle"><img src="images/X-logo.svg" loading="lazy" alt="" className="icon-1x1-16" /></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="colum-testimonial">
                                                    <div className="item-testimonial">
                                                        <div className="text-main-14">Liquid Nation lays the groundwork for the next significant phase of Monero: the growth of its decentralized peer-to-peer exchanges.</div>
                                                        <div className="item-testimonial_bottom">
                                                            <div className="testimonial-author"><img src="images/image-211.png" loading="lazy" alt="" className="author-image" />
                                                                <div className="author-name">
                                                                    <div className="author-name-text">xenu</div>
                                                                    <div className="text-main-14">Digital Cash Advocate</div>
                                                                </div>
                                                            </div>
                                                            <a href="https://x.com/xenumonero" target="_blank" className="source-circle"><img src="images/X-logo.svg" loading="lazy" alt="" className="icon-1x1-16" /></a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="colum-testimonial is-next">
                                                    <div className="item-testimonial">
                                                        <div className="text-main-14">Liquid Nation sets the standard for cryptocurrency trading, what should have been the norm from the start: non-custodial, peer-to-peer, privacy-focused, and permission-less. Accessible to anyone with nothing more than an internet connection.</div>
                                                        <div className="item-testimonial_bottom">
                                                            <div className="testimonial-author"><img src="images/image-216.png" loading="lazy" alt="" className="author-image" />
                                                                <div className="author-name">
                                                                    <div className="author-name-text">Untraceable</div>
                                                                    <div className="text-main-14">Digital Cash Advocate</div>
                                                                </div>
                                                            </div>
                                                            <a href="https://x.com/DontTraceMeBruh" target="_blank" className="source-circle"><img src="images/X-logo.svg" loading="lazy" alt="" className="icon-1x1-16" /></a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="colum-testimonial">
                                                    <div className="item-testimonial is-hide">
                                                        <div className="text-main-14">The platform is user-friendly and efficient. I appreciate the anonymity and transparency it offers. It’s a game-changer for crypto enthusiasts!</div>
                                                        <div className="item-testimonial_bottom">
                                                            <div className="testimonial-author"><img src="images/Frame-1000002947.png" loading="lazy" alt="" className="author-image" />
                                                                <div className="author-name">
                                                                    <div className="author-name-text">James Walker</div>
                                                                    <div className="text-main-14">Somone</div>
                                                                </div>
                                                            </div>
                                                            <div className="source-circle"><img src="images/X-logo.svg" loading="lazy" alt="" className="icon-1x1-16" /></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="section">
                    <div className="overflow-hidden">
                        <div className="padding-global">
                            <div className="container-large">
                                <div id="download" className="spacer-xhuge is-half"></div>
                                <div className="block-wrapper">
                                    <div className="h2-center">
                                        <div className="clip is-720">
                                            <div className="text-color-white">
                                                <h2>Ecosystem & Community</h2>
                                            </div>
                                        </div>
                                        <div className="clip is-520">
                                            <div>Join the revolution. Contribute to the code, learn from documentation, or connect with the community.</div>
                                        </div>
                                    </div>
                                    <div className="download-grid-and-cta">
                                        <div className="download-grid">
                                            <div className="anime-stroke-card-wrapper">
                                                <div className="download-card">
                                                    <div className="download-card-top">
                                                        <div className="icon-wrapper-circle">
                                                            <div className="icon-1x1-32 w-embed"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="white"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg></div>
                                                        </div>
                                                        <div className="subtitle-18">Liquid Nation Codebase</div>
                                                        <div className="text-main-14 text-color-white-60">Open Source Code</div>
                                                    </div>
                                                    <div className="download-card-bottom">
                                                        <a href="#" className="button-second w-inline-block">
                                                            <div>Visit</div>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="stroke-rectangle is-white"></div>
                                                <div className="stroke-rectangle is-gradient"></div>
                                            </div>
                                            <div id="w-node-_591ec9c7-21ae-f317-7bba-7dbbf5685aa7-d144478d" className="anime-stroke-card-wrapper">
                                                <div id="w-node-_93d8099f-9e86-4265-5fc4-49f1532fac44-d144478d" className="download-card">
                                                    <div className="download-card-top">
                                                        <div className="icon-wrapper-circle"><img src="images/Icon-Container.png" loading="lazy" alt="" className="icon-1x1-32" /></div>
                                                        <div className="subtitle-18">Documentation</div>
                                                        <div className="text-main-14 text-color-white-60">Learn how it works</div>
                                                    </div>
                                                    <div className="download-card-bottom">
                                                        <a href="#" className="button-second w-inline-block">
                                                            <div>Visit</div>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="stroke-rectangle is-white"></div>
                                                <div className="stroke-rectangle is-gradient"></div>
                                            </div>
                                            <div id="w-node-_113703f8-e64d-68c2-9b61-62eac6dfb456-d144478d" className="anime-stroke-card-wrapper">
                                                <div id="w-node-ae400f10-27e9-3666-43ef-8df5b06d8fc3-d144478d" className="download-card">
                                                    <div className="download-card-top">
                                                        <div className="icon-wrapper-circle"><img src="images/Hands.png" loading="lazy" alt="" className="icon-1x1-32" /></div>
                                                        <div className="subtitle-18">Community</div>
                                                        <div className="text-main-14 text-color-white-60">Discord</div>
                                                    </div>
                                                    <div className="download-card-bottom">
                                                        <a href="#" className="button-second w-inline-block">
                                                            <div>Visit</div>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="stroke-rectangle is-white"></div>
                                                <div className="stroke-rectangle is-gradient"></div>
                                            </div>
                                            <div id="w-node-_19cb7406-6865-9cc6-295c-5e4c36082f17-d144478d" className="anime-stroke-card-wrapper">
                                                <div id="w-node-_255a96f5-b0a8-fcf0-4223-c10ccec0f82f-d144478d" className="download-card">
                                                    <div className="download-card-top">
                                                        <div className="icon-wrapper-circle"><img src="images/X-logo.svg" loading="lazy" alt="" className="icon-1x1-32" /></div>
                                                        <div className="subtitle-18">Updates</div>
                                                        <div className="text-main-14 text-color-white-60">X (Twitter)</div>
                                                    </div>
                                                    <div className="download-card-bottom">
                                                        <a href="#" className="button-second w-inline-block">
                                                            <div>Visit</div>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="stroke-rectangle is-white"></div>
                                                <div className="stroke-rectangle is-gradient"></div>
                                            </div>
                                        </div>
                                        <div className="main-cta">
                                            <div className="cta-content">
                                                <div className="h2-center">
                                                    <div className="text-color-white">
                                                        <h2>Join our Telegram!</h2>
                                                    </div>
                                                    <div className="clip is-460">
                                                        <div>Be the first to hear about the latest news, updates and important events in the Liquid Nation ecosystem!</div>
                                                    </div>
                                                </div>
                                                <a href="https://t.me/liquidnation" className="button w-inline-block">
                                                    <div>Join Telegram</div>
                                                </a>
                                            </div><img src="images/Group-48098168.avif" loading="eager" alt="" className="image-cta-bg" /><img src="images/Group-40275.avif" loading="eager" alt="" className="image-cta-bg is-2" />
                                            <div className="cta-prime-line"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="two-last-sections">
                    <section id="faq" className="section">
                        <div className="padding-global">
                            <div className="container-large">
                                <div className="spacer-huge"></div>
                                <div className="block-wrapper">
                                    <div className="faq-component">
                                        <div className="faq-left">
                                            <div className="sticky-faq">
                                                <h2 className="text-color-white">Answers to the most frequent questions</h2>
                                            </div>
                                        </div>
                                        <div className="faq-wrapper">
                                            <div className="faq-list">
                                                <div className="faq-accordion-and-stroke">
                                                    <div className="faq_accordion">
                                                        <div className="faq_question">
                                                            <div className="faq_heading">What is Liquid Nation, and how does it work?</div>
                                                            <div className="element-and-stroke">
                                                                <div className="faq_icon-wrapper">
                                                                    <div className="accordion-icon_component">
                                                                        <div className="accordion-icon_horizontal-line"></div>
                                                                        <div className="accordion-icon_vertical-line"></div>
                                                                    </div>
                                                                </div>
                                                                <div className="bg-faq-icon"></div>
                                                                <div className="circle-stroke-liner"></div>
                                                            </div>
                                                        </div>
                                                        <div className="faq_answer">
                                                            <div>Liquid Nation is a decentralized P2P cross-chain exchange protocol empowered by Charms. It enables trustless swapping of assets directly on Bitcoin without the need for liquidity pools or bridges.</div>
                                                            <div className="faq-space-medium"></div>
                                                        </div>
                                                    </div>
                                                    <div className="stroke-rectangle is-white"></div>
                                                    <div className="stroke-rectangle is-gradient"></div>
                                                </div>
                                                <div className="faq-accordion-and-stroke">
                                                    <div className="faq_accordion">
                                                        <div className="faq_question">
                                                            <div className="faq_heading">Is Liquid Nation safe to use?</div>
                                                            <div className="element-and-stroke">
                                                                <div className="faq_icon-wrapper">
                                                                    <div className="accordion-icon_component">
                                                                        <div className="accordion-icon_horizontal-line"></div>
                                                                        <div className="accordion-icon_vertical-line"></div>
                                                                    </div>
                                                                </div>
                                                                <div className="bg-faq-icon"></div>
                                                                <div className="circle-stroke-liner"></div>
                                                            </div>
                                                        </div>
                                                        <div className="faq_answer">
                                                            <div>Yes. Liquid Nation is non-custodial and utilizes Zero-Knowledge Proofs (ZK-Proofs) via the Charms protocol. This ensures that every trade is cryptographically verified and that you maintain full control of your assets at all times.</div>
                                                            <div className="faq-space-medium"></div>
                                                        </div>
                                                    </div>
                                                    <div className="stroke-rectangle is-white"></div>
                                                    <div className="stroke-rectangle is-gradient"></div>
                                                </div>
                                                <div className="faq-accordion-and-stroke">
                                                    <div className="faq_accordion">
                                                        <div className="faq_question">
                                                            <div className="faq_heading">Do I need to deposit funds?</div>
                                                            <div className="element-and-stroke">
                                                                <div className="faq_icon-wrapper">
                                                                    <div className="accordion-icon_component">
                                                                        <div className="accordion-icon_horizontal-line"></div>
                                                                        <div className="accordion-icon_vertical-line"></div>
                                                                    </div>
                                                                </div>
                                                                <div className="bg-faq-icon"></div>
                                                                <div className="circle-stroke-liner"></div>
                                                            </div>
                                                        </div>
                                                        <div className="faq_answer">
                                                            <div>No. Liquid Nation is completely non-custodial. You trade directly from your own wallet. There is no deposit or withdrawal process—you simply sign a transaction when you want to swap, and assets move directly to your destination address.</div>
                                                            <div className="faq-space-medium"></div>
                                                        </div>
                                                    </div>
                                                    <div className="stroke-rectangle is-white"></div>
                                                    <div className="stroke-rectangle is-gradient"></div>
                                                </div>
                                                <div className="faq-accordion-and-stroke">
                                                    <div className="faq_accordion">
                                                        <div className="faq_question">
                                                            <div className="faq_heading">What are the fees?</div>
                                                            <div className="element-and-stroke">
                                                                <div className="faq_icon-wrapper">
                                                                    <div className="accordion-icon_component">
                                                                        <div className="accordion-icon_horizontal-line"></div>
                                                                        <div className="accordion-icon_vertical-line"></div>
                                                                    </div>
                                                                </div>
                                                                <div className="bg-faq-icon"></div>
                                                                <div className="circle-stroke-liner"></div>
                                                            </div>
                                                        </div>
                                                        <div className="faq_answer">
                                                            <div>We prioritize efficiency. You only pay standard network transaction fees for the underlying blockchain (e.g., Bitcoin mining fees). Liquid Nation does not charge any additional platform or hidden fees.</div>
                                                            <div className="faq-space-medium"></div>
                                                        </div>
                                                    </div>
                                                    <div className="stroke-rectangle is-white"></div>
                                                    <div className="stroke-rectangle is-gradient"></div>
                                                </div>
                                                <div className="faq-accordion-and-stroke">
                                                    <div className="faq_accordion">
                                                        <div className="faq_question">
                                                            <div className="faq_heading">Which currencies does Liquid Nation support?</div>
                                                            <div className="element-and-stroke">
                                                                <div className="faq_icon-wrapper">
                                                                    <div className="accordion-icon_component">
                                                                        <div className="accordion-icon_horizontal-line"></div>
                                                                        <div className="accordion-icon_vertical-line"></div>
                                                                    </div>
                                                                </div>
                                                                <div className="bg-faq-icon"></div>
                                                                <div className="circle-stroke-liner"></div>
                                                            </div>
                                                        </div>
                                                        <div className="faq_answer">
                                                            <div>Liquid Nation primarily operates on Bitcoin's layer for security. We support native Bitcoin assets and are actively integrating true cross-chain support for Cardano and other major networks in upcoming releases.</div>
                                                            <div className="faq-space-medium"></div>
                                                        </div>
                                                    </div>
                                                    <div className="stroke-rectangle is-white"></div>
                                                    <div className="stroke-rectangle is-gradient"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="spacer-xhuge"></div>
                            </div>
                        </div>
                    </section>
                    <section className="section">
                        <div className="padding-global">
                            <div className="container-large">
                                <div className="spacer-huge is-footer"></div>
                                <div className="footer">
                                    <div className="footer-first-line"><img src="/name.png" loading="lazy" alt="Liquid Nation" className="logo-footer" style={{ height: '45px', width: 'auto' }} />
                                        {/* <div className="footer-menu">
                                            <a href="#about" className="footer-link">About</a>
                                            <a href="#start" className="footer-link">Start</a>
                                            <a href="#feedback" className="footer-link">Feedback</a>
                                            <a href="#download" className="footer-link">Download</a>
                                            <a href="#faq" className="footer-link">FAQ</a>
                                        </div> */}
                                        <div className="footer-social">
                                            <a href="https://github.com/EcosystemNetwork/Liquid-Nation" target="_blank" className="button-blur w-inline-block">
                                                <div className="icon-1x1-16 w-embed"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="white"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg></div>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="footer-divider"></div>
                                    <div className="footer-last-line">
                                        <div className="text-color-grey">
                                            <div className="text-main-14">@2025 Liquid Nation. All rights reserved</div>
                                        </div>
                                        <div className="group-links">
                                            <a href="#" className="footer-link">Liquid Nation Github</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="spacer-medium is-footer"></div>
                            </div>
                        </div>
                        <div className="footer-bg-top"><img src="images/Frame-1000002984_1.avif" loading="lazy" alt="" className="footer-bg-image" /></div>
                        <div className="footer-bg-under">
                            <div className="footer-glow"></div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Home;
