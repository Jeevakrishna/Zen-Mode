import { useState } from "react";

import { Flex, Title, TextInput, Textarea, Paper, Text, Anchor } from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import splitbee from "@splitbee/web";
import Head from "next/head";

import Button from "@/components/common/Button";
import Social from "@/components/common/Social";

type FormValues = {
	name: string;
	email: string;
	message: string;
};

const Contact = () => {
	const [loading, setLoading] = useState(false);

	const form = useForm({
		initialValues: {
			name: "",
			email: "",
			message: "",
		},
		validate: {
			message: isNotEmpty("Message cannot be empty"),
		},
	});

	const submitForm = async (values: FormValues) => {
		setLoading(true);
		const res = await fetch("/api/sendgrid", {
			body: JSON.stringify(values),
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
		});
		setLoading(false);

		splitbee.track("Contact", values);

		const { error } = await res.json();
		if (error) {
			showNotification({
				title: ":(",
				message: "We had trouble sending your message. Please try again in a few seconds.",
				color: "red",
				autoClose: 6000,
			});
			return;
		}

		showNotification({
			title: "Message sent",
			message: "Thank you for taking the time to contact us!",
			color: "green",
			autoClose: 6000,
		});
		form.reset();
	};

	return (
		<>
			<Head>
				<title>Contact | daily.place</title>
				<meta
					name="title"
					content="Contact | Work Ripple"
				/>
				<meta
					name="description"
					content="Questions, feedback or help about Work Ripple"
				/>
			</Head>
			<div>
				<Title order={3}>Contact</Title>
				<Text component="p">
					If you have any questions, feedback, or need help with the app, just send us an email using the form
					below:
				</Text>
			</div>

			<Flex
				w="100%"
				gap={25}
				sx={{
					"@media (max-width: 768px)": {
						flexDirection: "column",
					},
				}}
			>
				<Paper
					p="md"
					withBorder
					miw={400}
					sx={{
						"@media (max-width: 576px)": {
							minWidth: "100%",
						},
					}}
				>
					<form onSubmit={form.onSubmit(submitForm)}>
						<TextInput
							placeholder=" Jeeva krishna"
							label="Name"
							mb={20}
							{...form.getInputProps("name")}
						/>

						<TextInput
							placeholder="abc@x-files.com"
							label="Email"
							mb={20}
							{...form.getInputProps("email")}
						/>

						<Textarea
							placeholder="I want to believe"
							label="Message"
							withAsterisk
							{...form.getInputProps("message")}
						/>

						<Flex
							justify="flex-end"
							mt={25}
						>
							<Button
								type="submit"
								loading={loading}
							>
								Send
							</Button>
						</Flex>
					</form>
				</Paper>
				<div>
					<Text component="p">You can also write us directly to our e-mail or social networks:</Text>

					<Flex
						gap={20}
						wrap="wrap"
						align="center"
					>
						<Anchor href="mailto:Voltaverse@proton.me">Voltaverse@proton.me</Anchor>

						<Social />
					</Flex>
				</div>
			</Flex>
		</>
	);
};

export default Contact;
