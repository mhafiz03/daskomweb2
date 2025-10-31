import TableHistory from "../Tables/TableHistory"

export default function ContentHistory() {
    return (
        <section className="space-y-6 text-depth-primary">
            <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-depth-lg border border-depth bg-depth-card px-10 py-3 shadow-depth-sm">
                    <h6 className="text-lg font-semibold text-depth-primary">History Praktikum</h6>
                </div>
            </div>

            <TableHistory />
        </section>
    );
}
