(() => {
    'use strict';
    class e {
        static Get(e) {
            if (Object.prototype.hasOwnProperty.call(this.fieldData, e)) return this.fieldData[e];
        }
        static Set(e, t) {
            this.fieldData[e] = t;
        }
    }
    e.fieldData = {};
    class t {}
    (t.EventCycleDisplayTime = 'EventCycleDisplayTime'),
        (t.EventAlertSlideTime = 'EventAlertSlideTime'),
        (t.EventAlertFadeTime = 'EventAlertFadeTime'),
        (t.EventAlertDisplayTime = 'EventAlertDisplayTime');
    class n {
        static toMilliseconds(e) {
            return 1e3 * e;
        }
        static toSeconds(e) {
            return e / 1e3;
        }
    }
    class r {
        static toPromise(e, t, n) {
            return e && t && n
                ? e.style[t] === n
                    ? Promise.resolve()
                    : new Promise((r) => {
                          const s = (n) => {
                              n.propertyName === t &&
                                  (e.removeEventListener('transitionend', s), r());
                          };
                          e.addEventListener('transitionend', s), (e.style[t] = n);
                      })
                : Promise.reject();
        }
    }
    class s {
        constructor(n, r) {
            (this.eventService = n),
                (this.alertService = r),
                (this.alertDisplayTime = e.Get(t.EventAlertDisplayTime)),
                (this.eventDisplayTime = e.Get(t.EventCycleDisplayTime));
        }
        addEvents(...e) {
            if (!e) throw new Error("Parameter 'events' cannot be null or undefined.");
            e.forEach((e) => this.eventService.registerEvent(e));
        }
        beginCycle() {
            this.initializeCurrentSlide().then((e) => this.cycleContent(e));
        }
        triggerAlert(e, t = !0) {
            t && this.addEvents(e);
            const n = this.getBar(),
                r = this.getCurrentSlide(),
                s = this.alertService.createAlertSlide(e);
            this.placeSlideOffscreenBottom(s),
                n.appendChild(s),
                Promise.all([this.animateSlideUpOut(r), this.animateSlideUpIn(s)])
                    .then(() => n.removeChild(r))
                    .then(() => this.waitForAlertDisplay())
                    .then(() => this.markAlertAsRead(s))
                    .then(() => this.cycleContent(s));
        }
        animateSlideUpIn(e) {
            return (
                this.requestBrowserAnimation(e),
                new Promise((t) => {
                    const n = (r) => {
                        'transform' === r.propertyName &&
                            (e.removeEventListener('transitionend', n), t());
                    };
                    e.addEventListener('transitionend', n), e.classList.remove('offscreen-bottom');
                })
            );
        }
        animateSlideUpOut(e) {
            return new Promise((t) => {
                const n = (r) => {
                    'transform' === r.propertyName &&
                        (e.removeEventListener('transitionend', n), t());
                };
                e.addEventListener('transitionend', n), e.classList.add('offscreen-top');
            });
        }
        cycleContent(e) {
            this.processSlideContent(e).then(() => {
                e === this.getCurrentSlide() && this.cycleContent(e);
            });
        }
        getBar() {
            return document.querySelector('.bar');
        }
        getCurrentSlide() {
            const e = this.getBar();
            if (!e) throw new Error("Element with '.bar' class not found.");
            const t = e.children;
            if (!t || t.length < 1) throw new Error('No children found in bar.');
            return t[0];
        }
        getSlideContent(e) {
            return e.children[0];
        }
        hideContent(e) {
            const t = this.getSlideContent(e);
            return new Promise((e) => {
                const n = (r) => {
                    'opacity' === r.propertyName &&
                        (t.removeEventListener('transitionend', n), e());
                };
                t.addEventListener('transitionend', n), t.classList.add('hidden');
            });
        }
        initializeCurrentSlide() {
            const e = this.getCurrentSlide(),
                t = this.eventService.getCurrentEvent();
            return this.populateSlide(e, t).then(() => e);
        }
        markAlertAsRead(e) {
            return new Promise((t) => {
                const n = (r) => {
                    'background-color' === r.propertyName &&
                        (e.removeEventListener('transitionend', n), t());
                };
                e.addEventListener('transitionend', n), (e.classList.value = 'slide');
            });
        }
        placeSlideOffscreenBottom(e) {
            e.classList.add('offscreen-bottom');
        }
        populateSlide(e, t) {
            const n = this.getSlideContent(e);
            return new Promise((e) => {
                (n.innerHTML = t.html), e();
            });
        }
        processSlideContent(e) {
            return this.waitForEventDisplay()
                .then(() => this.hideContent(e))
                .then(() => this.populateSlide(e, this.eventService.getNextEvent()))
                .then(() => this.revealContent(e));
        }
        requestBrowserAnimation(e) {
            e.offsetWidth;
        }
        revealContent(e) {
            const t = this.getSlideContent(e);
            return new Promise((e) => {
                const n = (r) => {
                    'opacity' === r.propertyName &&
                        (t.removeEventListener('transitionend', n), e());
                };
                t.addEventListener('transitionend', n), t.classList.remove('hidden');
            });
        }
        waitForAlertDisplay() {
            return new Promise((e) => {
                window.setTimeout(() => e(), this.alertDisplayTime);
            });
        }
        waitForEventDisplay() {
            return new Promise((e) => {
                window.setTimeout(() => e(), this.eventDisplayTime);
            });
        }
    }
    class i {
        constructor(e) {
            this.type = e;
        }
    }
    var a;
    !(function (e) {
        (e[(e.Cheer = 0)] = 'Cheer'),
            (e[(e.Follow = 1)] = 'Follow'),
            (e[(e.GiftedSubscription = 2)] = 'GiftedSubscription'),
            (e[(e.Host = 3)] = 'Host'),
            (e[(e.Raid = 4)] = 'Raid'),
            (e[(e.Subscription = 5)] = 'Subscription');
    })(a || (a = {}));
    class l extends i {
        constructor(e, t) {
            if ((super(a.Cheer), (this.name = e), (this.amount = t), !e))
                throw new Error("Parameter 'name' cannot be null or empty.");
            if (t < 1) throw new Error("Parameter 'amount' cannot be less than 1.");
            this.html = this.generateHtml();
        }
        generateHtml() {
            const e = `X${this.amount.toString()}`;
            return `<svg class="slide-icon" viewBox="0 0 187.35 242.67">\n                <path d="M221.2,159.15l-82.46-29.27a6.63,6.63,0,0,0-4.48,0L51.8,159.15a6.7,6.7,0,0,1-7.83-10l86.95-131a6.7,6.7,0,0,1,11.16,0l86.95,131A6.7,6.7,0,0,1,221.2,159.15Z" transform="translate(-42.83 -15.17)"/>\n                <path d="M220.25,195.51l-80.09,61.24a6.7,6.7,0,0,1-7.32,0L52.75,195.51a6.69,6.69,0,0,1,1.42-11.92l80.09-28.44a6.75,6.75,0,0,1,4.48,0l80.09,28.44A6.69,6.69,0,0,1,220.25,195.51Z" transform="translate(-42.83 -15.17)"/>\n            </svg><span class="slide-text">${this.name} ${e}</span>`;
        }
    }
    class o extends i {
        constructor(e) {
            if ((super(a.Follow), (this.name = e), !e))
                throw new Error("Parameter 'name' cannot be null or empty.");
            this.html = this.generateHtml();
        }
        generateHtml() {
            return `<i class="slide-icon fas fa-heart"></i><span class="slide-text">${this.name}</span>`;
        }
    }
    class c extends i {
        constructor(e, t) {
            if ((super(a.GiftedSubscription), (this.name = e), (this.amount = t), !e))
                throw new Error("Parameter 'name' cannot be null or empty.");
            if (t < 1) throw new Error("Parameter 'amount' cannot be less than 1.");
            this.html = this.generateHtml();
        }
        generateHtml() {
            const e = `X${this.amount.toString()}`;
            return ` <i class="slide-icon fas fa-gift"></i><span class="slide-text">${this.name} ${e}</span>`;
        }
    }
    class h extends i {
        constructor(e, t) {
            if ((super(a.Host), (this.name = e), (this.amount = t), !e))
                throw new Error("Parameter 'name' cannot be null or empty.");
            if (t < 1) throw new Error("Parameter 'amount' cannot be less than 1.");
            this.html = this.generateHtml();
        }
        generateHtml() {
            const e = `X${this.amount.toString()}`;
            return ` <i class="slide-icon fas fa-desktop"></i><span class="slide-text">${this.name} ${e}</span>`;
        }
    }
    class d extends i {
        constructor(e, t) {
            if ((super(a.Raid), (this.name = e), (this.amount = t), !e))
                throw new Error("Parameter 'name' cannot be null or empty.");
            if (t < 1) throw new Error("Parameter 'amount' cannot be less than 1.");
            this.html = this.generateHtml();
        }
        get isValid() {
            return !!this.html && !!this.name && !!this.amount && this.amount > 0;
        }
        generateHtml() {
            const e = `X${this.amount.toString()}`;
            return ` <i class="slide-icon fas fa-users"></i><span class="slide-text">${this.name} ${e}</span>`;
        }
        getRaidAmountString() {
            if (!(this.amount && this.amount > 0)) return '';
        }
    }
    class m extends i {
        constructor(e, t) {
            if ((super(a.Subscription), (this.name = e), (this.amount = t), !e))
                throw new Error("Parameter 'name' cannot be null or empty.");
            if (t < 1) throw new Error("Parameter 'amount' cannot be less than 1.");
            this.html = this.generateHtml();
        }
        generateHtml() {
            const e = `X${this.amount.toString()}`;
            return ` <i class="slide-icon fas fa-star"></i><span class="slide-text">${this.name} ${e}</span>`;
        }
    }
    class u {
        get bar() {
            return document.querySelector('.bar');
        }
        get currentSlide() {
            return this.slides[0];
        }
        get slides() {
            return this.bar.children;
        }
        addSlide(e) {
            this.bar.appendChild(e);
        }
        animateSlideDownOut(e, t = !1) {
            t && this.requestBrowserAnimation(e), e.classList.add('offscreen-bottom');
        }
        animateSlideUpIn(e, t = !1) {
            t && this.requestBrowserAnimation(e), e.classList.remove('offscreen-bottom');
        }
        animateSlideUpOut(e, t = !1) {
            t && this.requestBrowserAnimation(e), e.classList.add('offscreen-top');
        }
        createEventAlertSlide(e) {
            const t = document.createElement('div');
            t.classList.add('bar-content'), (t.innerHTML = e.html);
            const n = document.createElement('div');
            switch ((n.classList.add('slide'), n.appendChild(t), e.type)) {
                case a.Cheer:
                    n.classList.add(this.getCheerEventAlertCSS(e));
                    break;
                case a.Follow:
                    n.classList.add('follow-event-alert');
                    break;
                case a.Subscription:
                    n.classList.add('sub-event-alert');
                    break;
                case a.GiftedSubscription:
                    n.classList.add('gifted-sub-event-alert');
                    break;
                case a.Host:
                    n.classList.add('host-event-alert');
                    break;
                case a.Raid:
                    n.classList.add('raid-event-alert');
            }
            return n;
        }
        resetSlideStyles(e) {
            e.classList.value = 'slide';
        }
        getCheerEventAlertCSS(e) {
            return e.amount < 1
                ? null
                : e.amount < 100
                ? 'cheer-event-alert-tier-1'
                : e.amount < 1e3
                ? 'cheer-event-alert-tier-2'
                : e.amount < 5e3
                ? 'cheer-event-alert-tier-3'
                : e.amount < 1e4
                ? 'cheer-event-alert-tier-4'
                : 'cheer-event-alert-tier-5';
        }
        requestBrowserAnimation(e) {
            e.offsetWidth;
        }
    }
    class v {
        constructor() {
            (this.timeEventAlertDisplay = e.Get(t.EventAlertDisplayTime)),
                (this.timeEventDisplay = e.Get(t.EventCycleDisplayTime)),
                (this.timeEventAlertSlide = e.Get(t.EventAlertSlideTime)),
                (this.timeEventAlertFade = e.Get(t.EventAlertFadeTime)),
                (this.bar = new u());
        }
        get currentEvent() {
            const e = this.events[this.currentEventIndex];
            if (!e) throw new Error('');
            return e;
        }
        get nextEvent() {
            this.currentEventIndex = this.calculateNextEventIndex();
            const e = this.events[this.currentEventIndex];
            if (!e) throw new Error('');
            return e;
        }
        displayEvents() {
            const e = this.bar.currentSlide,
                t = e.children[0];
            e.addEventListener('transitionend', (e) => {
                'opacity' === e.propertyName &&
                    ('1' === t.style.opacity
                        ? setTimeout(() => this.hideElement(t), this.timeEventDisplay)
                        : ((t.innerHTML = this.nextEvent.html), this.revealElement(t)));
            }),
                t.innerHTML.trim() || (t.innerHTML = this.currentEvent.html),
                window.setTimeout(() => this.hideElement(t), this.timeEventDisplay);
        }
        handleEventAlert(e, t = !0) {
            clearTimeout(this.currentEventAlertTimeout), t && this.registerEvent(e);
            const n = this.bar.createEventAlertSlide(e);
            this.bar.animateSlideDownOut(n),
                this.bar.addSlide(n),
                this.bar.animateSlideUpOut(this.bar.currentSlide),
                this.bar.animateSlideUpIn(n, !0),
                (this.currentEventAlertTimeout = window.setTimeout(() => {
                    const e = this.bar.slides;
                    for (let t = 0; t < e.length - 1; t++) e[t].remove();
                    this.currentEventAlertTimeout = window.setTimeout(() => {
                        this.bar.resetSlideStyles(n),
                            (this.currentEventAlertTimeout = window.setTimeout(() => {
                                this.displayEvents();
                            }, this.timeEventAlertFade));
                    }, this.timeEventAlertDisplay);
                }, this.timeEventAlertSlide));
        }
        registerEvent(e) {
            if (!e) return;
            const t = this.events.findIndex((t) => t.type === e.type);
            if (-1 === t) this.currentEventIndex = this.events.push(e) - 1;
            else {
                let n;
                t > this.currentEventIndex
                    ? (this.events.splice(t, 1),
                      (n =
                          this.currentEventIndex === this.events.length - 1
                              ? 0
                              : this.currentEventIndex + 1),
                      this.events.splice(n, 0, e))
                    : t < this.currentEventIndex
                    ? (this.events.splice(t, 1),
                      (n =
                          this.currentEventIndex - 1 == 0
                              ? this.events.length - 1
                              : this.currentEventIndex - 2),
                      this.events.splice(n, 0, e))
                    : (this.events.splice(t, 1, e), (n = t)),
                    (this.currentEventIndex = n);
            }
        }
        registerEvents(e) {
            e && e.forEach((e) => this.registerEvent(e));
        }
        calculateNextEventIndex() {
            return this.currentEventIndex === this.events.length - 1
                ? 0
                : this.currentEventIndex + 1;
        }
        hideElement(e) {
            e && (e.style.opacity = '0');
        }
        revealElement(e) {
            e && (e.style.opacity = '1');
        }
        beginEventCycle() {
            const e = this.bar.currentSlide.children[0];
            !!e.innerHTML || (e.innerHTML = this.currentEvent.html), this.cycleEvent();
        }
        cycleEvent() {
            const e = this.bar.currentSlide,
                t = e.children[0];
            this.displayEvent(t)
                .then(() => {
                    e === this.bar.currentSlide && this.cycleEvent();
                })
                .catch(() => {});
        }
        displayEvent(e) {
            return new Promise((t, n) => {
                window.setTimeout(() => {
                    this.hideElementAux(e)
                        .then(() => ((e.innerHTML = this.nextEvent.html), this.revealElementAux(e)))
                        .then(() => {
                            t();
                        })
                        .catch((e) => {
                            n(e);
                        });
                }, this.timeEventDisplay);
            });
        }
        revealElementAux(e) {
            return r.toPromise(e, 'opacity', '1');
        }
        hideElementAux(e) {
            return r.toPromise(e, 'opacity', '0');
        }
    }
    v.SInit =
        ((v.prototype.timeEventAlertDisplay = 2e3),
        (v.prototype.timeEventDisplay = 1e4),
        (v.prototype.timeEventAlertSlide = 750),
        (v.prototype.timeEventAlertFade = 2e3),
        (v.prototype.currentEventIndex = -1),
        void (v.prototype.events = []));
    class p {
        createAlertSlide(e) {
            const t = document.createElement('div');
            t.classList.add('slide-content'), (t.innerHTML = e.html);
            const n = document.createElement('div');
            n.classList.add('slide'), n.appendChild(t);
            const r = this.lookupAlertCssClass(e);
            return n.classList.add(r), n;
        }
        lookupAlertCssClass(e) {
            if (!e) throw new Error("Parameter 'event' cannot be null or undefined.");
            let t;
            switch (e.type) {
                case a.Cheer:
                    t = this.lookupCheerAlertCssClass(e.amount);
                    break;
                case a.Follow:
                    t = 'follow-alert';
                    break;
                case a.GiftedSubscription:
                    t = 'gifted-sub-alert';
                    break;
                case a.Host:
                    t = 'host-alert';
                    break;
                case a.Raid:
                    t = 'raid-alert';
                    break;
                case a.Subscription:
                    t = 'sub-alert';
            }
            return t;
        }
        lookupCheerAlertCssClass(e) {
            if (e <= 0) throw new Error("Parameter 'amount' cannot be less than or equal to 0.");
            return e < 100
                ? 'cheer-alert-tier-1'
                : e < 1e3
                ? 'cheer-alert-tier-2'
                : e < 5e3
                ? 'cheer-alert-tier-3'
                : e < 1e4
                ? 'cheer-alert-tier-4'
                : 'cheer-alert-tier-5';
        }
    }
    class E {
        constructor() {
            (this.events = []), (this.eventIndex = -1);
        }
        getCurrentEvent() {
            if (this.events.length > 0 && this.eventIndex >= 0) return this.events[this.eventIndex];
            throw new Error('There are no events.');
        }
        getNextEvent() {
            if (this.events.length > 0 && this.eventIndex >= 0)
                return this.advanceEventIndex(), this.events[this.eventIndex];
            throw new Error('There are no events.');
        }
        registerEvent(e) {
            if (!e) throw new Error("Parameter 'event' cannot be null or undefined.");
            const t = this.events.findIndex((t) => t.type === e.type);
            -1 !== t && this.events.splice(t, 1),
                this.events.push(e),
                1 === this.events.length && (this.eventIndex = 0);
        }
        advanceEventIndex() {
            this.eventIndex < 0 || this.eventIndex + 1 === this.events.length
                ? (this.eventIndex = 0)
                : (this.eventIndex += 1);
        }
    }
    const w = ['bot:counter', 'event:test', 'event:skip', 'message'];
    let f = new E(),
        y = new p(),
        S = new s(f, y);
    window.addEventListener('onEventReceived', function (e) {
        if (
            ((e) => {
                try {
                    const t = e.detail.listener;
                    return w.includes(t);
                } catch {
                    return !1;
                }
            })(e)
        )
            return;
        const t = e.detail.listener,
            n = e.detail.event;
        -1 === w.indexOf(t) &&
            ('follower-latest' === t
                ? S.triggerAlert(new o(n.name))
                : 'cheer-latest' === t
                ? S.triggerAlert(new l(n.name, n.amount))
                : 'subscriber-latest' === t
                ? n.gifted && n.isCommunityGift
                    ? SE_API.resumeQueue()
                    : n.bulkGifted
                    ? S.triggerAlert(new c(n.sender, n.amount))
                    : n.gifted
                    ? S.triggerAlert(new c(n.sender))
                    : S.triggerAlert(new m(n.name, n.amount))
                : 'host-latest' === t
                ? S.triggerAlert(new h(n.name, n.amount), !1)
                : 'raid-latest' === t
                ? S.triggerAlert(new d(n.name, n.amount), !1)
                : SE_API.resumeQueue());
    }),
        window.addEventListener('onWidgetLoad', function (e) {
            const t = e.detail.session.data,
                n = e.detail.fieldData;
            g(n);
            const r = [b(t), A(t), C(t), x(t)];
            (f = new E()), (y = new p()), (S = new s(f, y)), S.addEvents(...r), S.beginCycle();
        });
    const g = function (r) {
            const s = n.toMilliseconds(r.eventCycleDisplayTime),
                i = n.toMilliseconds(r.eventAlertDisplayTime),
                a = n.toMilliseconds(r.eventAlertSlideTime),
                l = n.toMilliseconds(r.eventAlertFadeTime);
            e.Set(t.EventCycleDisplayTime, s),
                e.Set(t.EventAlertDisplayTime, i),
                e.Set(t.EventAlertSlideTime, a),
                e.Set(t.EventAlertFadeTime, l);
        },
        b = function (e) {
            const t = e['follower-latest'];
            return new o(t.name);
        },
        A = function (e) {
            const t = e['subscriber-latest'];
            return new m(t.name, t.amount);
        },
        C = function (e) {
            const t = e['subscriber-gifted-latest'];
            return new c(t.name, t.amount);
        },
        x = function (e) {
            const t = e['cheer-latest'];
            return new l(t.name, t.amount);
        };
})();
