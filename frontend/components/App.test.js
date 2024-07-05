import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"

import AppFunctional from "./AppFunctional"

// Write your tests here
// test('sanity', () => {
//   expect(true).toBe(false)
// })
describe('My custom tests', () => {
    let user, upBtn, leftBtn
    beforeEach(() => {
        user = userEvent.setup()
        render(<AppFunctional />)
        upBtn = screen.getByText("UP")
        leftBtn = screen.getByText("LEFT")
    })
    test("Check that the keypad buttons have text", () => {
        screen.getByText("RIGHT")
        screen.getByText("DOWN")
        screen.getByText("reset")
        expect(upBtn).toBeInTheDocument()
        expect(leftBtn).toBeInTheDocument()
    })
    test("Check that the coordinates & move count update", async () => {
        const coords = screen.getByText("Coordinates (2, 2)")
        const moveCt = screen.getByText("You moved 0 times")
        await user.click(upBtn)
        await user.click(leftBtn)
        expect(coords).toHaveTextContent("Coordinates (1, 1)")
        expect(moveCt).toHaveTextContent("You moved 2 times")
    })
    test("Confirm that all the edges update the message", async () => {
        const rightBtn = screen.getByText("RIGHT")
        const downBtn = screen.getByText("DOWN")
        await user.click(rightBtn)
        await user.click(rightBtn)
        const messageBox = screen.queryByText("You can't go right")
        expect(messageBox).toBeInTheDocument()
        await user.click(leftBtn)
        await user.click(leftBtn)
        await user.click(leftBtn)
        expect(messageBox).toHaveTextContent("You can't go left")
        await user.click(downBtn)
        await user.click(downBtn)
        expect(messageBox).toHaveTextContent("You can't go down")
        await user.click(upBtn)
        await user.click(upBtn)
        await user.click(upBtn)
        expect(messageBox).toHaveTextContent("You can't go up")
    })
    test("Confirm typing in the email textbox updates the text", async () => {
        const emailBox = screen.queryByPlaceholderText("type email")
        expect(emailBox).toBeInTheDocument()
        await user.type(emailBox, "asdf@asdf.com")
        expect(emailBox.value).toBe("asdf@asdf.com")
    })
    test("Check the return messages for various emails, and that the email clears after each", async () => {
        const emailBox = screen.getByPlaceholderText("type email")
        const submitBtn = screen.getByRole('button', { name: /submit/i })
        await user.type(emailBox, "asdf@asdf.com")
        await user.click(submitBtn)
        expect(await screen.findByText('asdf win #', { exact: false })).toBeVisible()
        expect(emailBox.value).toBe("")
        await user.type(emailBox, "foo@bar.baz")
        await user.click(submitBtn)
        expect(await screen.findByText('foo@bar.baz failure #', { exact: false })).toBeVisible()
        await user.click(submitBtn)
        expect(await screen.findByText('Ouch: email is required', { exact: false })).toBeVisible()
    })
})
