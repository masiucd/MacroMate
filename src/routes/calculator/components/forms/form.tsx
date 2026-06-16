import type {Page} from "../../types"
import {ActivityLevelForm} from "./activity_level"
import {GoalForm} from "./goal"
import {MacrosForm} from "./macros"
import {PersonalDetailsForm} from "./personal_details"

export function FormComponent({page}: {page: Page}) {
	switch (page) {
		case "personal_details":
			return <PersonalDetailsForm />
		case "activity_level":
			return <ActivityLevelForm />
		case "goal":
			return <GoalForm />
		case "macros":
			return <MacrosForm />
		default:
			return null
	}
}
