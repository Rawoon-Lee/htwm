import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface PicData {
	data: string
	url: string
}

const initialStatePicData: PicData[] = []

const picListSlice = createSlice({
	name: "picList",
	initialState: initialStatePicData,
	reducers: {
		getPicList: (state, action: PayloadAction<PicData[]>) => {
			return action.payload
		}
	}
})

export const { getPicList } = picListSlice.actions
export default { picList: picListSlice.reducer }
