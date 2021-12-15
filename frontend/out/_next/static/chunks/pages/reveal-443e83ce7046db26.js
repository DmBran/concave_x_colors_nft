;(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [177],
  {
    84491: function (e, n, t) {
      ;(window.__NEXT_P = window.__NEXT_P || []).push([
        '/reveal',
        function () {
          return t(85714)
        },
      ])
    },
    85714: function (e, n, t) {
      'use strict'
      t.r(n),
        t.d(n, {
          default: function () {
            return j
          },
        })
      var r = t(28520),
        a = t.n(r),
        s = t(85893),
        c = t(8271),
        i = t(40108),
        u = t.n(i),
        o = t(61127),
        l = t(6151),
        f = t(55480),
        d = t(7868),
        x = t(21092),
        v = t(67294),
        h = t(11163)
      function m(e, n, t, r, a, s, c) {
        try {
          var i = e[s](c),
            u = i.value
        } catch (o) {
          return void t(o)
        }
        i.done ? n(u) : Promise.resolve(u).then(r, a)
      }
      function p(e) {
        return function () {
          var n = this,
            t = arguments
          return new Promise(function (r, a) {
            var s = e.apply(n, t)
            function c(e) {
              m(s, r, a, c, i, 'next', e)
            }
            function i(e) {
              m(s, r, a, c, i, 'throw', e)
            }
            c(void 0)
          })
        }
      }
      function j() {
        var e = (0, h.useRouter)().query,
          n = (0, x.useWeb3Context)(),
          t = (0, v.useState)(null),
          r = t[0],
          i = t[1]
        function m(e, n) {
          return j.apply(this, arguments)
        }
        function j() {
          return (j = p(
            a().mark(function e(t, r) {
              var s
              return a().wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (
                        (e.next = 2),
                        r.methods
                          .getTokenSVG(
                            n.library.eth.abi.encodeParameter('uint256', t)
                          )
                          .call()
                      )
                    case 2:
                      return (s = e.sent), i(s), e.abrupt('return', s)
                    case 5:
                    case 'end':
                      return e.stop()
                  }
              }, e)
            })
          )).apply(this, arguments)
        }
        return (
          (0, v.useEffect)(
            p(
              a().mark(function t() {
                var r
                return a().wrap(function (t) {
                  for (;;)
                    switch ((t.prev = t.next)) {
                      case 0:
                        if (!n.active) {
                          t.next = 5
                          break
                        }
                        return (
                          (r = new n.library.eth.Contract(
                            c.Mt,
                            '0x2ED6550746891875A7e39d3747d1a4FFe5433289'
                          )),
                          (t.next = 4),
                          m(e.tokenID, r)
                        )
                      case 4:
                        t.sent
                      case 5:
                      case 'end':
                        return t.stop()
                    }
                }, t)
              })
            ),
            []
          ),
          (0, s.jsxs)('div', {
            className: u().mainContainer,
            children: [
              (0, s.jsx)(f.w, {}),
              (0, s.jsx)(o.w, {}),
              (0, s.jsxs)('div', {
                className: u().container,
                children: [
                  (0, s.jsx)('div', {
                    className: u().main,
                    children: (0, s.jsxs)('main', {
                      className: u().modal,
                      children: [
                        n.active &&
                          (0, s.jsxs)('div', {
                            children: [
                              (0, s.jsx)('p', {
                                className: 'text-center text-xl font-bold',
                                children: 'Your Sync X Color',
                              }),
                              r &&
                                (0, s.jsx)('main', {
                                  className:
                                    'pb-4 mx-auto flex justify-center mt-10 center-items',
                                  children: (0, s.jsx)('div', {
                                    dangerouslySetInnerHTML: { __html: r },
                                  }),
                                }),
                              !r && (0, s.jsx)(d.a, {}),
                            ],
                          }),
                        !n.active &&
                          (0, s.jsx)('div', {
                            className:
                              'flex-1 flex center-content justify-center',
                            children: (0, s.jsx)('p', {
                              className: 'font-bold',
                              children: 'Please Connect via MetaMask',
                            }),
                          }),
                      ],
                    }),
                  }),
                  (0, s.jsx)(l.$, {}),
                ],
              }),
            ],
          })
        )
      }
    },
    11163: function (e, n, t) {
      e.exports = t(90387)
    },
  },
  function (e) {
    e.O(0, [47, 39, 774, 888, 179], function () {
      return (n = 84491), e((e.s = n))
      var n
    })
    var n = e.O()
    _N_E = n
  },
])
