import { mount } from "enzyme"
import * as React from "react"
import { MockRelayRenderer } from "../MockRelayRenderer"
import {
  Artwork,
  badQuery,
  query,
  renderToString,
} from "./MockRelayRendererFixtures"

jest.unmock("react-relay")

describe("MockRelayRenderer", () => {
  it("renders a Relay tree", done => {
    const tree = mount(
      <MockRelayRenderer
        Component={Artwork}
        query={query}
        mockResolvers={{
          Artwork: () => ({
            title: "Mona Lisa",
            image: {
              url: "http://test/image.jpg",
            },
            artist: null,
          }),
        }}
      />
    )
    setTimeout(() => {
      expect(tree.html()).toEqual(
        renderToString(
          <div>
            <img src="http://test/image.jpg" />
            <div>Mona Lisa</div>
          </div>
        )
      )
      done()
    }, 10)
  })

  it("renders an error when child components throw", done => {
    console.log = () => null // MockRelayRenderer prints out error info to the console, let's silence it.
    const tree = mount(
      <MockRelayRenderer
        Component={Artwork}
        query={badQuery}
        mockResolvers={{
          Artwork: () => ({
            title: "Mona Lisa",
            image: {
              url: "http://test/image.jpg",
            },
            artist: null,
          }),
        }}
      />
    )
    tree.setState({
      caughtError: {
        error: new Error("Hey it's an error!"),
        errorInfo: {},
      },
    })
    setTimeout(() => {
      console.log(tree.text())
      expect(tree.update().text()).toEqual(
        "Error occurred while rendering Relay component: Error: Hey it's an error!"
      )
      done()
    }, 10)
  })
})
