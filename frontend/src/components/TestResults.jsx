
const TestResults = ({ headers, data }) => {
    return (
        <div className="testResults">
            <table>
                <tr>
                    {headers.map(w => <th>{w}</th>)}
                </tr>
                {data.map(w => <tr>
                    {w.map(a => <td>{a}</td>)}
                </tr>)}
            </table>
        </div>
    )
}

export default TestResults;