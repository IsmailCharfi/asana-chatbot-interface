import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from "../index";
import { Config, ConfigState, MessageHistory } from "../types";

const DEFAULT_CLOSE_ICON =
  "data:image/svg+xml,%3Csvg width='512' height='512' viewBox='0 0 512 512' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_112_5)'%3E%3Cpath d='M512 51.2L460.8 0L256 204.8L51.2 0L0 51.2L204.8 256L0 460.8L51.2 512L256 307.2L460.8 512L512 460.8L307.2 256L512 51.2Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_112_5'%3E%3Crect width='512' height='512' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A";

const initialState: ConfigState = {
  config: {
    apiPath: null,
    primaryColor: "#f06a6a",
    secondaryColor: "#f4f7f9",
    primaryTextColor: "#ffffff",
    secondaryTextColor: "#000000",
    badgeColor: "#f22424",
    backgroundImage:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgzIiBoZWlnaHQ9IjE4NSIgdmlld0JveD0iMCAwIDE4MyAxODUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xNzcgMTdDMTc5LjIwOSAxNyAxODEgMTUuMjA5MSAxODEgMTNDMTgxIDEwLjc5MDkgMTc5LjIwOSA5IDE3NyA5QzE3NC43OTEgOSAxNzMgMTAuNzkwOSAxNzMgMTNDMTczIDE1LjIwOTEgMTc0Ljc5MSAxNyAxNzcgMTdaIiBzdHJva2U9IiNEMkQyRDIiIHN0cm9rZS13aWR0aD0iMS4yNSIvPgo8cGF0aCBkPSJNMjEuNSAxLjVMNDQuNSAxMi41TTE1LjUgOTYuNUwxMS43MSAxMDYuODc3TTI4LjAzNyAxMzIuNEwzMy45MzUgMTM0LjYwM0wzMC40NzUgMTQwLjU1TDM2LjU0NyAxNDIuOTQyTDMyLjYxNCAxNDguN00xNjEuMzQ3IDE4NC4wN0wxNjIuMDQgMTc0Ljc1NEwxNzIuMzMyIDE3NC44MDZMMTcyLjc0OCAxNjUuNTg0TDE4Mi4wMjIgMTY1LjkxNk0xLjUgNDkuNUMxLjUgNDkuNSA3LjYzMSA1NS45MTMgOC4zNDcgNjQuMzA1QzkuMDYyIDcyLjY5OCA1LjgyNyA3OS4xMTEgNS44MjcgNzkuMTExTTEyNS41NTUgOTFDMTI1LjU1NSA5MSAxMTguMTExIDkxIDExMS44ODUgOTcuMTkyQzEwNS42NTggMTAzLjM4NCAxMDcuMDQ3IDEwOS4yMDQgMTA3LjA0NyAxMDkuMjA0TTEwOS4yODcgMTc3LjgzQzEwOS4yODcgMTc3LjgzIDEwNS4yNjEgMTY4LjgwNSA5MS4xNDIgMTY4LjgwNUM3Ny4wMjMgMTY4LjgwNSA3Mi45OTcgMTc0LjUwNSA3Mi45OTcgMTc0LjUwNSIgc3Ryb2tlPSIjRDJEMkQyIiBzdHJva2Utd2lkdGg9IjEuMjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTg2LjcxNiAzNy4xNDZMOTEuOTU5IDI3LjYyNUgxMDMuMDUyTDEwOC40NjggMzcuMTQ2TDEwMy4wNTggNDYuMzMxSDkxLjk1M0w4Ni43MTYgMzcuMTQ2Wk0xNTAuNjI1IDUyLjYyNUgxNjEuMzc1VjYzLjM3NUgxNTAuNjI1VjUyLjYyNVoiIHN0cm9rZT0iI0QyRDJEMiIgc3Ryb2tlLXdpZHRoPSIxLjI1Ii8+CjxwYXRoIGQ9Ik03Mi41IDEwQzczLjMyODQgMTAgNzQgOS4zMjg0MyA3NCA4LjVDNzQgNy42NzE1NyA3My4zMjg0IDcgNzIuNSA3QzcxLjY3MTYgNyA3MSA3LjY3MTU3IDcxIDguNUM3MSA5LjMyODQzIDcxLjY3MTYgMTAgNzIuNSAxMFoiIGZpbGw9IiNEMkQyRDIiLz4KPHBhdGggZD0iTTE3MS41IDk4QzE3Mi4zMjggOTggMTczIDk3LjMyODQgMTczIDk2LjVDMTczIDk1LjY3MTYgMTcyLjMyOCA5NSAxNzEuNSA5NUMxNzAuNjcyIDk1IDE3MCA5NS42NzE2IDE3MCA5Ni41QzE3MCA5Ny4zMjg0IDE3MC42NzIgOTggMTcxLjUgOThaIiBmaWxsPSIjRDJEMkQyIi8+CjxwYXRoIGQ9Ik04Mi41IDEzN0M4My4zMjg0IDEzNyA4NCAxMzYuMzI4IDg0IDEzNS41Qzg0IDEzNC42NzIgODMuMzI4NCAxMzQgODIuNSAxMzRDODEuNjcxNiAxMzQgODEgMTM0LjY3MiA4MSAxMzUuNUM4MSAxMzYuMzI4IDgxLjY3MTYgMTM3IDgyLjUgMTM3WiIgZmlsbD0iI0QyRDJEMiIvPgo8cGF0aCBkPSJNMTQuNSAyNkMxNS4zMjg0IDI2IDE2IDI1LjMyODQgMTYgMjQuNUMxNiAyMy42NzE2IDE1LjMyODQgMjMgMTQuNSAyM0MxMy42NzE2IDIzIDEzIDIzLjY3MTYgMTMgMjQuNUMxMyAyNS4zMjg0IDEzLjY3MTYgMjYgMTQuNSAyNloiIGZpbGw9IiNEMkQyRDIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05NCA3Mkg5N1Y3NUg5NFY3MlpNMTI3IDE1NkgxMzBWMTU5SDEyN1YxNTZaTTQyIDE3NEg0NVYxNzdINDJWMTc0WiIgZmlsbD0iI0QyRDJEMiIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTQwLjM4NCA1Mi4xMjJMNDYuMTQyIDQ3LjY2OEw1Mi41OTUgNTEuODczTDUwLjMwMSA1OS4yMzZINDIuNTExTDQwLjM4NCA1Mi4xMjJaTTEzMS4xOTUgNS4wMzAwM0wxNDUuMDI1IDEwLjA5MkwxMzQuOTM1IDE3LjE0TDEzMS4xOTUgNS4wMzAwM1pNNDguMTk1IDEwMC4wM0w2My4wMjUgMTA1LjQ1OUw1Mi4yMDUgMTEzLjAxNkw0OC4xOTUgMTAwLjAzWk02LjIxMzAxIDE2Mi40OTVMMTcuNTQxIDE4My4zOTJMMy4yNjUwMSAxODFMNi4yMTMwMSAxNjIuNDk1WiIgc3Ryb2tlPSIjRDJEMkQyIiBzdHJva2Utd2lkdGg9IjEuMjUiLz4KPHBhdGggZD0iTTE1MC4wNSAxMjguNDY4QzE1MC4wNSAxMjguNDY4IDE0OS41NCAxMzAuNjUxIDE1MS4wNDUgMTMxLjgzNEMxNTIuNjA1IDEzMy4wNiAxNTkuNjg3IDEyOS45MzkgMTU1LjAxMiAxMjQuMDQ5QzE1Mi42NDUgMTIxLjU3MiAxNDguNTEyIDEyMC44MjMgMTQ1LjY4MiAxMjQuMDQ5QzE0MC40NzQgMTI5Ljk4NSAxNDUuNjgyIDE0MS41NTkgMTU3LjI5MiAxMzcuNzc5QzE2OS43NSAxMzEuNTIyIDE2Mi45MjUgMTE2LjEyMyAxNTIuMjE5IDExNS4xMjVDMTQ1LjYxNyAxMTQuNTE5IDEzOC4xNzYgMTE2Ljg4MSAxMzYuMDYyIDEyNS4zOTNDMTM0LjM0NCAxMzIuMzEzIDEzNy42NDYgMTQyLjc4IDE0OC41MTIgMTQ1Ljg2OUMxNTkuMzc4IDE0OC45NTkgMTY3Ljg0MyAxNDEuNTU5IDE2Ny44NDMgMTQxLjU1OSIgc3Ryb2tlPSIjRDJEMkQyIiBzdHJva2Utd2lkdGg9IjEuMjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K",
    badgeTextColor: "#ffffff",
    fontFamily: "Lato, sans-serif",
    headerText: "Assistant Asana",
    headerIcon:
      "data:image/svg+xml,%3Csvg version='1.2' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 168 168' width='32' height='32'%3E%3Ctitle%3Ehttps___s3%3C/title%3E%3Cdefs%3E%3Cimage width='114' height='114' id='img1' href='data:image/png;base64,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'/%3E%3C/defs%3E%3Cstyle%3E%3C/style%3E%3Cuse id='Background' href='%23img1' x='27' y='16'/%3E%3C/svg%3E",
    avatar:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='168' height='168' viewBox='0 0 168 168' fill='none'%3E%3Crect width='168' height='168' fill='url(%23pattern0)'/%3E%3Cdefs%3E%3Cpattern id='pattern0' patternContentUnits='objectBoundingBox' width='1' height='1'%3E%3Cuse xlink:href='%23image0_109_2' transform='scale(0.00595238)'/%3E%3C/pattern%3E%3Cimage id='image0_109_2' width='168' height='168' xlink:href='data:image/png;base64,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'/%3E%3C/defs%3E%3C/svg%3E",
    openIcon:
      "data:image/svg+xml,%3Csvg version='1.2' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 168 168' width='48' height='48'%3E%3Ctitle%3Ehttps___s3%3C/title%3E%3Cdefs%3E%3Cimage width='168' height='168' id='img1' href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACoCAYAAAB0S6W0AAAAAXNSR0IB2cksfwAAFMhJREFUeJztXVuQlMUV7he8gQJWbg+pPOcpj3lLVaryYC0LLLsryB3Cgoqwi4BBjDFqVKCWSJmLBgStBNQiVmkwxmssryjeUIyVEBTRxBg1wvxz253Z2/zp7/zd//TM7s7OzM5M9/x7vqqund39L6dPf3P6dvocIRgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGIwyEb/mGi4RKJFFjRX1XVm+Jst5thtsqpXIwrZiuTBBS8K2YrkwQUvCtmK5MEFLwrZiuTBBS8K2YrkwQUvCtmK5MEFLwrZiuTBBS8K2YrkwQUvCtmK5MEFLwrZia1rWrxfxq68OfuL3DRtEfOPGoODzWNdEpEQWthVbE1KigICbNon45s1BwWdNTE3U4v/j7/p+2/Vggo4N24qdFDHxs6dHxK+9ln73li0T3vz5F8bmzJkVW7BAeIsXC2/58qDIz/ib/N8Mec00XEvPAFHxDPOZTVgiC9uKrapoa9ndTaSMzZ9/QXztWpHcvfvSvkcffTtz7Jg/cPKkP/SvT/yhzz4Lyief0N8yrx/zcY28djbu8drapnlLl9GzQqtqu35M0DxsK7ayAovXQ901WcclS0Ryz55vZY4e9Ye+/NLPDQ76fi7nTwh5Da7FPbgXz8Cz8EwaCsCiNpk1jSxsK7asoseYW7YIb8UK4S1aJFJ797UPnjrl54aHR5HPHxkJSqnP5i3yGXhWat++Djwb74hv2Zwfo9quPxPU4QKCwKrJiY3sjs9P3HKLGHjvvTzJShCvtBX1R98nf+LZeIfXtuA8mkzh3U1A0sjCtmInJGd3sEzkzZs3Pf3ww0+PpFKFxKyElOOStfBZeAfehXcSQbvdJ2lkYVuxpcnZTWuW3sKFIvPyy3lCDQ3VhphjERXPVsA78W5aN4UsDpM0srCt2HHJqbpWzLCzx9/Jk6h4zFkPGO/IvvOOT7N8bc0dJWlkYVux45ITS0jSemWPH89bt3pYzfFgvA8yeAsvD6zoRjcnTpGFbcWOWTAham2d2f/883my2IJ6N2SBTDRx2uCAjpig9sgZa+8Q6T/84Y6CmbplguJn+uDB3lh7Oy13WdcTE9RCQbe+pkvEt/1EDJ87G/CiEWPOCaBlGD53zo9v2yZlXCPiPd329cUEbTRBNwqvs1NkXnutgBguIDcczO6zx475kJEmTLb1xQRtYMFa58pVIrlz5/TcwEDjJ0UTQckD2ZK7ds7wVq0MJnO29cYEbUDBOuOmTcJb0HZ+9q23AkJg4dw1KJkgo7dgwTRyLoHstvXHBK1j0QvyXWtE4obtYqS/PyCDS9ZTQ+80SRnj27cHY1FHFvAjC9uKJQskZ8WxuXNn9B058veACDZZOAGUbH2PPfaB19p6Cc3oHbCikYVtxZLHUE+P8Do6BDyKCC527xpKNshKkyW45jngQxpZWFWs8mj3urpEfOtWMZJIBCRwsXvX0N28lBUyk+wYi1ru5iML6wTFrhH8O3/72+/R7N0ggZNQskHW1N13fx+y0+4SE7Q+sE5QOCHPmze975FHjuVq5T5Xbyj3PMhMLnkYhzJB6wOrBEXB1qacbGT0vrvL408NJSP253FAjyyoZT1GFrYVixOZ3ty5F2defz1ofId2j8bFsFoPlTJDdjpVygStD2wrVhPU6QX6YpgL9ujimaD1g23FNj1B2YLWF7YVG45Bjx4NGr8puvhAxszRV33IzmPQOsK2YmkW39o6s++pp9Lh4TXXoVYb+qXMMb2bxAStD6wqlpaZNgs4XqQPHborV6/DcLUGvJqkrJDZa18wjc7Q8zJTfWCdoBiDLl8ukjt2XJjLZEICOAu9UC9lhcyQXceGYoLWAdYJqryBsGU4/MUXAQlc7uaVbENSVtrmNOrABK0DrBKUStDNY8E7+8YbAQmawIJmpKy0SI/u/Rp2t6sbbCuWXNUwk1+4UKT27m11mpwaUkbICplpBs/udvWDbcWGZcMG4a1eLYY+/zwggYvdvO7epYyQlc7I29YbE7QBRR/5aG8XiN1pksEpKJn6/vSnE5A1cLOzbz2ZoI0qV11Fk41hbUUdWrQPjx5/8blPY07IaltfTNAGF1jRzk6RfuCBe4gNrrjfGRsI6QcfPECe9LCetvXFBG1wUaEOKSbTu+8G3HDAimoZsidO+N6ihWFISOv6YoI2uJhHQLZsEcNffRUwxCZJddd+9qxP27KQ7Vr7RzyYoLaKOuWJePHJ3b2X5rJZeyRV74QMyd27Z3pXXBHEZbraLXIyQRtd1gdro9ijx3ojJUdoNEk1OeW7pQwtUhZ19siNWTsT1HbRB+ra2s5P/e53Pwr36UGcek6c8GxNTvlO+e4fShmcOBjHBHWtaJJ2dIjEjh0XDf33vyGJ6jJ5MsiPpS7EicK7XScnE9Q2STEmXbaUdpuQpCtcxAdRa7CgnyvK9IHzUbSztXSJcOHEJhPU9aIt6ZVX0m5T6p57fjB45kwRy3Kjyygmlr4Gz8RwAu/Au5rBcjJBXSnarQ1hcuRs2lu1SqTvu38zJfPSM/2JCDnWJfJePCN9//1b8EyaqSOcTZNlm4ssbCu24qLzdMrPlBWus1Mkbr1V9P/lL58P/POfFAV5pK+PIn/QOFUl68Jn/A3/wzW4FvfgXjyDIoTg+U2arzOysK3YSRVl6WD5Yi0tszHjx98xuUnv378yffjwI3A+QUn/8fCf0wf2r8X/iNzyWrpH3htaTNv1YYKOhm3FTqroXO8g19atwfERjFPlhAqzb0rNPXfuDBwNxmf6G/6H8SUsJe7RXXkTdedM0GYrIBd2oKj77wkmNyDfWAX/26RCJuKeJicmE7QasuAnCKAScunJTUHRf9fjPbqvBmTR1jC0iqqM+vtk67q+sK4T1RO6KKgrE7Qs1ExJoQXbpKyUmsisXUtjRJx+9JYtC8rKlUH4bPhUovFwPU5G6sNnLls1LR9khcyQHZ9lXVAnqpuuJ+qMuq/tCu41daMtOBO0NGrWYFjQxlplV1c4/qMjubIxEj//uUju2nVxcvfuS5O9vbMSt90mEtu2ibgkb0xfi3yYsDLohlUSWetkHOtLCNkgI7KSSJml7LIOnSK+bh3VCXWTdZxJdZV1Rt3JQ2vZsqCeHe2BRxSIqjcBavCFjCwm3WDoxqQliWFtcs6c2VB6+ve/vxmZgrG+OPTZZ/5wLEYprnN9ff5IOk3RiYf/9z9/6OOPffh9It47pXZZvJhi1ZNl1dE6XLCmWgbIJGWLtcpJF7ytdu28SMr+qqyDh7qgTqgb6kh1lXVG3aED6CLzyis+dEPBKqSuoDOywtDhJL+QkUXVSlHdubdihYjNm3dRcs+d30QwLfhNht5HZe815qgxBz86Q0Fh43KWTUTVYzvbBFVjZZJJygYZsetEuesrdFyBbqAj6Cq5Z8+3YFXjUoeTXX+NLKqyJio/ENYSE7t2XTLwj5N+LjtQuIOjFsjDYu7omH/Xi+nGvWhAOpiG8ZvsGsnKbGxwKmyddRlLV+iepSyQCbIVkNKsw0R1HSn0xMLGwcDJkz50SO586vBgNfWMLCpuNIwzMbaU48fMiy8WWkuzgSq0oGFDG/cO/ec/ZGVibW3nhTPkRpBUr63Kd+LdkAGyFMirSVltXY0vJXSYeeklH+NYb/mKqnwAIovyG+2aIJ8RXN9uv23a0L//XUjMWvpojuT3ztF4iCJHB9U0cepJUuMdeGf/k0/Gwy8hkauG9SyK5gedJm6/fRq5+FUYMS+yKFsJCE8zf/4F8PbBJIBQZ+dhuMHl1POzb77pk+XGBKpeaV/08AVLRvJdeGfAo9q49Y1f0byTNHSb2rv3R6GTNBO0zG69o12k7rtvI4VIhE7Vz3ojZ3SHA++952NSFi731JKkem0TY2v5DrwrYMxIfclp1tXQLXlXhcdMJq5nZFGORcExYMpj1GBy5lsu3xVmjx/3IQ9NYGp59Fc9j448vx0EN7FxLt/UMXROdS3jFGlkMW6ltZVavVokfvrTMAuctXPqBkn7n3vOJ8+lWsXl1HFK5TPxbILFoBFax9B54sYbRRweVxP0GJHFuA2m1iCxID14+nSgONvxkhRpIAdOe0K2SY9HdS8hn0WH8zQxLddV63rwo498qqfeyx+nrpHFuI22dauItcyZhRl0oDEHQtD4+YYb/vJLH4vmoQ9ANSTVX0Q8Y906gWea77AOpfP+p5/OxubMuZi2WKc8QXV3h25Fdi/D8XigLFcaDdBBZJHp7bLLvl6q4SYkKL6I8hn9OtOdI19EgtL5iGwDdPXUJuMMayKLUY2mtjCxfZl57bVAUQ7ERyqAkXE4ccMNFFe04vGo/iL++Mcicf31YkR/EV0iKKBT3hw75ss2uXC8LdHIYlTD4QgFJkY3/UzA0YHgkvXUKM6XWU0qGGw8tLTM7nc5T6ge0si2SNx0U/BlHON4SmQxJkHb2+kQmqkg52BEO6Yz7HIMGTRcOVY02C2ie+TvTkd1BvSX8YknztLa6JQlqOo64HQ7+OGHBcpxDmqmnRsY9FMHDqzzLr9cVJSSEN27vAf3Up76EkeTrUPP6E+f9smBxmirqUVQLCuhe7/1VhFuZ7raaIAen73yik8huXt6ynNZwzWqp8C95rOchB5zp/v8xC9+Idto1Sg3xMhi1KQBEY4ffPBAoBFHIhyPB8OyxHGEBMtF5ewu4RpsacoJkvM9BTBWhOeiSWFkMYqg2E158cVAMS43GqAnEGfP+ont24lw5RLUWyNn7/Ie8u80nuUs9DhUts1Yu2iRRfEEKSbHZVnDUcJpqHEjBZj95S+/Ro4k3WUQFGHG5bW4h8LmuDz+1NAOM3/7W+CLUDRRiiyKx2ZoOGyvmUpxFobnemr//lW0JVjOERG1hZu6997FuQliNzkDPZw5cybw6JpykyRd4a4uEXqPNwNB9djsgQfuofhK5YSwAUGlFUK2YrrZ9bE2oJfVZNvgNENBm00ZgiK89ZXrRBgotokI2nf48CO01FQOQXu6KfVi+qGHDtLNzURQ2Tbkg7D+6qlI0PWBBf20CS0ocrdjbFZuFy+tbfrgwV66uZkICguqsyxPOYJidrt8eehe1xQE1WNQOZ6sfAy674qJ4oc6A9P9DmNQM5TOlCCo8oukWfyJEwVKcRZ6Fp/JIE3Mpd6K5eUTVDZyord39giSMzQRQbHCEtNDmSm1zGSsg2Zcdp4woddBv/rKh0cSxXsqdx20aw2FqgmThTVJXTMvvOAjPc/UWwc1LGjTzG51t/fBBz4t0le6k7R6tcC95rOcRPFqBSxo0UmCyGJU1wf/yJtvFhTWRSvHVei9+Jde8mPay6eSvXh5T0bvmjXFXnzaT9xyS+ByN+X24nXDYbFeTpQQwz3QiqOWBWNP2kUa8FP77u30FlbhzYTTqvv2tWE3KefyOFT3FKdO5Rfpp9xCvS7o5tsXiL4jj50irdQ7s1u1UBaPll3QXSOgQ4X+oBQEQpahTz8teKZTMII6IAog2masVOCRxehFbOVRD0eKc+cCJbloRbXzxLPP5mItLdPpXFK51lMXOhjYcqF8RsEznYKeCMq2IIeYKe9Rj64D3d+8edO1r6QLOdsLoMdk8bgfv+66YPZe6fFjM/W3JOqI5xU82xXkTJ9X2SY0jJnSZ5L0chMafdu2/GEyl6xL3nr60gLOIutZTQBY3BNY0en9zzwzbD7bCZinOmVbUJtM+VOdmqTXbRVea+vMviNH/m4qyzqMPWnq7rTVr5ScZo+Bn6tWueeDoP0M5NgTbRHfeh2fiw8JqsejHR1i4FQwX7I+idChD6UcyV/96jveksWTD8eowi16S5aI5F13fTuso22SKjmge/Kg1+NOJqjRcFgXld1KYsuW/BjNZmwmPZt9/PFPg92UGoVh1MMa+Uw8O6ynrfGojs2Erl0OQahr59hMJSYSsC69vbOQ5zLQXIOti0FOpMoO3epqmVOTFu+76UwWpfzWRGk0SZVukYQh2bt7NnRfzgQwsijLuiA+6KJFFIIxJGmjLKmx3UqhF9FgkKte8UHlZ3g6ZY+rEIyNDCSmLafUceruu79P7oMcH7TMxpPdPCxX8s47v1Ews69X4xURI3v0qE9puNXYuG4RljEeBUnluzLynSHq6Zdg6BG6RcYU6iV0HqUyZI8sKmo8ZUnj27eLwY8/ziu4ll0hti+NzB9wpUPaF0rXotPS1DtGvUpdiHfi3ZBBEylX47qaPRF0Sovx0HGFiRQii4obT0W+Q1eLdcjQqQSoNvOFbqwii4wz60ifTUsseszZqCwfyqEk1tp6SWLnzhmh1xNQbTYTs54GMaHD/r8+S8OXUhHsmKDlFJ1dTloYBO1K3HHHBUhKFUYiKSbbWLmDzP+P4aSBbBd9Dz/8lLd0aZDypoKuruZExdAGOTelLJCpILuJrmtBfUrlSSokNcaa0B10SAHQdLbmKjYdIovqGk75XerGk+OlxI4dF/W/8AIF86rGsoDgA++/76cOHfo1pRtEbiS8A12dzbydeDdkwBcSMknZUgcP3QVZC76U5QKJyqSO4HgMywzdhV9CGr5UV9fIYlLWBT9VFji4gVF8JNmgyd/85rv9Tz2dRZABeBsNe16Qv1KO5Ub6+/2RZJIiJOPsU+bVVymcCwVoxSQIM1d4GZnZj22R06yrzsqMFDVSRsgKmSE76jD44ekgV6esG+pIdZV1Rt2hA+gCkZKhG/K+kroiYqpsdgU6ZYLmUZPG05MXlRQV3SFyKlHWY3i6ywZAY8IRGjEuscdP18kxF13X2ZlfjFbDh8k2WO2LkgWyqSx0lH4bsqMOOLAHa4uMx7KOVFckQFBBclUG6Augm3CYpHKAcrbjEqhLYxbljKcUf2ik1asDdzF4EOksIrAeuK6WKWUaVSAzZNfWHnVCOnJVT/pyqhiko3RS4xJZ1KXhYBH0uNG0rmgcbTlMK+libvhyC2Rfb1jXseqqd7zMa5mg5aEhjYhGKS62idWoupbl4c8EZTAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDCihf8D4EONmn6GTH4AAAAASUVORK5CYII='/%3E%3C/defs%3E%3Cstyle%3E%3C/style%3E%3Cuse id='Background' href='%23img1' x='0' y='0'/%3E%3C/svg%3E",
    closeIcon: DEFAULT_CLOSE_ICON,
    width: "30vw",
    errorMessage: "Une erreur est survenue. Merci de réessayer plus tard.",
    firstMessage:
      "Bonjour! je suis votre assistant Asana n'hésitez pas à me poser des questions!",
    showEmoji: true,
    showPreview: true,
    sendMessageApiCall: null,
    onOpen: () => {},
    onClose: () => {},
    onOpenEmoji: () => {},
    onSendMessage: (message: string, history: MessageHistory[]) => {},
    onReceiveMessage: (message: string) => {},
    onWaiting: (clientMessage: string) => {},
  },
  initialWidth: "30vw",
  token: null,
};

const slice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setConfig(
      state: ConfigState,
      action: PayloadAction<{ config: Partial<Config> }>
    ) {
      state.config = {
        ...state.config,
        ...action.payload.config,
      };

      if (state.config.closeIcon == DEFAULT_CLOSE_ICON) {
        state.config.closeIcon = DEFAULT_CLOSE_ICON.replace(
          "white",
          encodeURIComponent(state.config.primaryTextColor)
        );
      }
    },
    setOldWidth(
      state: ConfigState,
      action: PayloadAction<{ initialWidth: string }>
    ) {
      state.initialWidth = action.payload.initialWidth;
    },
    setToken(state: ConfigState, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
    },
  },
});

export const reducer = slice.reducer;

export const setConfig =
  (config: Partial<Config>): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.setConfig({ config }));
  };

export const setInitialWidth =
  (initialWidth: string): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.setOldWidth({ initialWidth }));
  };

export const setToken =
  (token: string): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.setToken({ token }));
  };

export default slice;
