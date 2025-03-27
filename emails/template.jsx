import {Body, Container, Head, Heading, Html, Preview, Section, Text} from "@react-email/components";

export default function EmailTemplate({
    userName = "",
    type = "Monthly-Report",
    data = {
    },
}) {
    if(type === "Monthly-Report") {
        return (
            <Html>
                <Head />
                <Preview>Your Monthly Financial Report</Preview>
                <Body style={styles.body}>
                    <Container style={styles.container}>
                        <Heading style={styles.title}>Monthly Financial Report</Heading>

                        <Text style={styles.text}>Hay {userName},</Text>
                        <Text style={styles.text}>
                            Here&rsquo;s your financial summary for {data?.month}:
                        </Text>

                        {/* Main Stats */}
                        <Section style={styles.statsContainer}>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Total Income</Text>
                                <Text style={styles.heading}>${data?.stats.totalIncome.toFixed(2)}</Text>
                            </div>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Total Expenses</Text>
                                <Text style={styles.heading}>${data?.stats.totalExpenses.toFixed(2)}</Text>
                            </div>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Net</Text>
                                <Text style={styles.heading}>
                                    ${(data?.stats.totalIncome - data?.stats.totalExpenses).toFixed(2)}
                                </Text>
                            </div>
                        </Section>

                        {/* Category Breakdown */}
                        {data?.stats?.byCategory && (
                            <Section style={styles.section}>
                                <Heading style={styles.heading}>Expenses by Category</Heading>
                                {Object.entries(data?.stats.byCategory).map(
                                    ([category, amount]) => (
                                        <div key={category} style={styles.row}>
                                            <Text style={styles.text}>{category}</Text>
                                            <Text style={styles.text}>${amount.toFixed(2)}</Text>
                                        </div>
                                    )
                                )}
                            </Section>
                        )}

                        {/* AI Insights */}
                        {data?.insights && (
                            <Section style={styles.section}>
                                <Heading style={styles.heading}>Prudentis AI&rsquo;s Insights</Heading>
                                {data.insights.map((insight, index) => (
                                    <Text key={index} style={styles.text}>
                                        • {insight}
                                    </Text>
                                ))}
                            </Section>
                        )}

                        <Text style={styles.footer}>
                            Thank you for using Prudentis AI. Keep tracking your finances for better
                            financial health!
                        </Text>
                    </Container>
                </Body>
            </Html>
        );

    }

    if(type === "Budget-Alert") {
        return (
            <Html>
                <Head/>
                <Preview>Budget Alert</Preview>
                <Body style = {styles.body}>
                    <Container style = {styles.container}>
                        <Heading style={styles.title}>Budget Alert</Heading>
                        <Text style={styles.text}>Hay {userName},</Text>
                        <Text style={styles.text}>
                            You&rsquo;ve used {data?.percentageUsed.toFixed(1)}% of your monthly budget. 0:)
                        </Text>
                        <Section style={styles.container}>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Budget Amount</Text>
                                <Text style={styles.heading}>${data?.budgetAmount}</Text>
                            </div>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Spent So Far</Text>
                                <Text style={styles.heading}>${data?.totalExpenses}</Text>
                            </div>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Remaining</Text>
                                <Text style={styles.heading}>
                                    ${data?.budgetAmount - data?.totalExpenses}
                                </Text>
                            </div>
                        </Section>
                    </Container>
                </Body>
            </Html>
        )
    }


}

const styles = {
    body:{
        backgroundColor: "#14162f",
        fontFamily: "-apple-system, sans-serif",
    },
    container:{
        backgroundColor: "#050323",
        margin: "0 auto",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 4px rgba(80, 80, 150, 0.1)",
    },
    title:{
        color: "#ffe254",
        fontSize: "32px",
        fontWeight: "bold",
        textAlign: "center",
        margin: "0 0 20px",
    },
    heading:{
        color: "#f5dc8c",
        fontSize: "20px",
        fontWeight: "600",
        margin: "0 0 16px",
    },
    text:{
        color: "#fff1c2",
        fontSize: "16px",
        margin: "0 0 16px",
    },
    statsContainer:{
        margin: "32px 0",
        padding: "20px",
        backgroundColor: "#121434",
        borderRadius: "5px",
    },
    stat:{
        marginBottom: "16px",
        padding: "12px",
        backgroundColor: "#181a3f",
        borderRadius: "4px",
        boxShadow: "0 1px 2px rgba(60, 60, 130, 0.05)",
    },
    section:{
        marginTop: "32px",
        padding: "20px",
        backgroundColor: "#121434",
        borderRadius: "5px",
        border: "1px solid #fff1c2",
    },
    row:{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid #fbf2c3",
        marginBottom: "8px",
    },
    footer:{
        color: "#ffdf7b",
        fontSize: "12px",
        marginTop: "16px",
        textAlign: "center",
    },
}