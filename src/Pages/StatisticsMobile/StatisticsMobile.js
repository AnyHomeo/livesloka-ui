import {Card, Chip} from "@material-ui/core"
import React, {useState} from "react"
import momentTZ from "moment-timezone"
import WhatsAppIcon from "@material-ui/icons/WhatsApp"
import {X, Check, MessageCircle} from "react-feather"
import {getComments} from "../../Services/Services"

const StatisticsMobile = ({
	data,
	toggleNewOldButton,
	toggleJoinButton,
	setSelectedCustomerId,
	drawerState,
	setDrawerState,
}) => {
	const fetchhData = async (commentsCustomerId) => {
		let {data} = await getComments(commentsCustomerId)
		return data.result
	}

	const CommentRender = ({id}) => {
		const [testing, setTesting] = useState()
		fetchhData(id).then((data) => setTesting(data && data[0]?.text))

		return (
			<>
				<p style={{fontSize: 12}}>{testing && testing}</p>
			</>
		)
	}
	return (
		<div style={{marginTop: 10}}>
			{data &&
				data.map((item, i) => (
					<>
						<Card
							style={{
								height: "auto",
								width: "100%",
								// borderRadius: 10,
								margin: 1,
								display: "flex",
								marginTop: 3,
								marginBottom: 3,
								boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
							}}
						>
							<div></div>
							<div
								style={{
									flex: 0.7,
									padding: 4,
								}}
							>
								<div style={{padding: 3}}>
									<p style={{fontSize: 12}}>{`${item.firstName} (${item.lastName})`}</p>

									<div style={{display: "flex", alignItems: "center"}}>
										<div>
											{item.isStudentJoined ? (
												<div
													style={{
														height: 20,
														width: 20,
														borderRadius: "50%",
														backgroundColor: "#27ae60",
														display: "flex",
														justifyContent: "center",
														alignItems: "center",
														marginRight: 5,
													}}
												>
													<Check
														style={{
															color: "white",
															height: 18,
															width: 18,
														}}
													/>
												</div>
											) : (
												<div
													style={{
														height: 20,
														width: 20,
														borderRadius: "50%",
														backgroundColor: "#eb4d4b",
														display: "flex",
														justifyContent: "center",
														alignItems: "center",
														marginRight: 5,
													}}
												>
													<X
														style={{
															color: "white",
															height: 18,
															width: 18,
														}}
													/>
												</div>
											)}
										</div>

										{item.autoDemo && item.paidTill ? (
											<Chip size="small" label={momentTZ(item.paidTill).format("MMM DD")} />
										) : (
											<div
												style={{
													height: 20,
													width: 20,
													borderRadius: "50%",
													backgroundColor: "#3867d6",
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													marginLeft: 5,
												}}
											>
												<p style={{color: "white", fontSize: 12, fontWeight: "400"}}>
													{item.numberOfClassesBought}
												</p>
											</div>
										)}
									</div>
								</div>
								<CommentRender id={item._id} />
							</div>

							<div
								style={{
									display: "flex",
									// width: 150,
									justifyContent: "space-between",
									alignItems: "center",
									flex: 0.333,
								}}
							>
								<div
									style={{
										height: 30,
										width: 30,
										borderRadius: "50%",

										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										marginRight: 5,
									}}
									onClick={() => {
										setSelectedCustomerId(item._id)
										setDrawerState({...drawerState, left: true})
									}}
								>
									<MessageCircle />
								</div>
								<div
									style={{
										height: 30,
										width: 30,
										borderRadius: "50%",
										backgroundColor: item?.isJoinButtonEnabledByAdmin ? "#eb4d4b" : "#20bf6b",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										marginRight: 5,
									}}
								>
									<p
										style={{color: "white", fontSize: 18}}
										onClick={() => toggleJoinButton(item, i)}
									>
										{item?.isJoinButtonEnabledByAdmin ? "J" : "CJ"}
									</p>
								</div>

								<div
									style={{
										height: 30,
										width: 30,
										borderRadius: "50%",
										backgroundColor: item?.autoDemo ? "#eb4d4b" : "#20bf6b",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										marginRight: 5,
									}}
								>
									<p
										style={{color: "white", fontSize: 14}}
										onClick={() => toggleNewOldButton(item, i)}
									>
										{item?.autoDemo ? "O" : "N"}
									</p>
								</div>

								<div
									style={{
										height: "100%",
										width: 50,
										backgroundColor: "#ecf0f1",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<WhatsAppIcon
										style={{color: "#e67e22", height: 35, width: 35}}
										onClick={() =>
											window.open(
												`https://api.whatsapp.com/send?phone=${
													item.whatsAppnumber.indexOf("+") !== -1
														? item.whatsAppnumber.split("+")[1].split(" ").join("")
														: item.countryCode
														? item.countryCode + item.whatsAppnumber.split(" ").join("")
														: item.whatsAppnumber.split(" ").join("")
												}`
											)
										}
									/>
								</div>
							</div>
						</Card>
					</>
				))}
		</div>
	)
}

export default StatisticsMobile
