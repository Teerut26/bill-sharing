import { api } from "@/utils/api";
import { Avatar, Card, NumberFormatter, Skeleton } from "@mantine/core";
import _ from "lodash";

interface Props {
  trip_id: string;
  onReload?: () => void;
}

export default function MembersPage(props: Props) {
  const getMembersFromTrip = api.tripRouter.getMembersFromTrip.useQuery({
    trip_id: props.trip_id ?? "",
  });
  return (
    <>
      <Skeleton visible={getMembersFromTrip.isLoading}>
        <div className="flex flex-col gap-3">
          {getMembersFromTrip.data?.members.map((member, index) => (
            <Card withBorder key={index}>
              <div className="flex items-center gap-2">
                <Avatar size={"md"} src={member.image} />
                <div className="flex flex-col">
                  <div>{member.email}</div>
                  <div className="flex">
                    <NumberFormatter
                      value={_.sumBy(member.expense_stakeholder.filter((v) => v.paid), (v) => {
                        return (v.percentage / 100) * v.expense.amount;
                      }).toFixed(2)}
                      thousandSeparator
                    />
                    /
                    <NumberFormatter
                      value={_.sumBy(member.expense_stakeholder, (v) => {
                        return (v.percentage / 100) * v.expense.amount;
                      }).toFixed(2)}
                      thousandSeparator
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Skeleton>
    </>
  );
}
